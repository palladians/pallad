import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { AccountInfoArgs, Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  getSignClient,
  NetworkType,
  signTransaction,
  TransactionBody
} from '@palladxyz/tx-construction'
import Client from 'mina-signer'
import { expect } from 'vitest'

import { AccountInfoGraphQLProvider } from '../../src/Providers/AccountInfo'
import { TxSubmitGraphQLProvider } from '../../src/Providers/TxSubmit/TxSubmitProvider'
// TO DO: create end-to-end suite with a local-network
const minaTxSubmitGql = 'https://proxy.berkeley.minaexplorer.com/' // Needs a different API than the explorer
const minaAccountInfoGql = 'https://proxy.berkeley.minaexplorer.com/' // Needs a different API than the explorer

describe('TxSubmitGraphQLProvider', () => {
  test('healthCheck', async () => {
    const provider = new TxSubmitGraphQLProvider(minaTxSubmitGql)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })
  let keyGen: MinaKeyGenerator
  let mnemonic: string
  let client: Client
  let network: NetworkType

  beforeEach(async () => {
    keyGen = new MinaKeyGenerator()
    const network: NetworkType = 'mainnet'
    client = await getSignClient(network)
    mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
  })

  it('should create a MinaKeyGenerator instance for Mina network', () => {
    const keyGen = KeyGeneratorFactory.create(Network.Mina)
    expect(keyGen).toBeInstanceOf(MinaKeyGenerator)
  })

  it('should return the correct wallet data for a known mnemonic', async () => {
    const expectedKeyPairData = {
      privateKey: 'EKExKH31gXH7t5KiYxdyEbtgi22vgX6wnqwmcbrANs9nQJt487iN',
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      hdIndex: 0
    }
    const keyGen = KeyGeneratorFactory.create(Network.Mina)
    const keyPair = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    expect(keyPair).to.deep.equal(expectedKeyPairData)
  })

  it('Alice should construct & sign a payment transaction correctly to Bob', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const privateKeyAlice = keyPairAlice.privateKey
    const payment: TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: 1,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      amount: 100
    }

    const signedPayment = await signTransaction(
      privateKeyAlice,
      payment,
      network
    )
    expect(signedPayment.data).toBeDefined()
    expect(signedPayment.signature).toBeDefined()

    const isVerified = client.verifyTransaction(signedPayment)
    expect(isVerified).toBeTruthy()
  })

  it('Alice should construct & sign a delegation transaction correctly', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const privateKeyAlice = keyPairAlice.privateKey
    const delegation: TransactionBody = {
      type: 'delegation',
      to: keyPairAlice.publicKey,
      from: keyPairAlice.publicKey,
      fee: 1,
      nonce: 0
    }

    const signedDelegation = await signTransaction(
      privateKeyAlice,
      delegation,
      network
    )
    expect(signedDelegation.data).toBeDefined()
    expect(signedDelegation.signature).toBeDefined()

    const isVerified = client.verifyTransaction(signedDelegation)
    expect(isVerified).toBeTruthy()
  })

  it('Alice submits a payment transaction to Bob', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const privateKeyAlice = keyPairAlice.privateKey
    const payment: TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: Number(500000000),
      nonce: Number(3), // TODO get proper nonce from the network
      memo: 'hello Bob',
      validUntil: Number(321),
      amount: Number(7000000000)
    }

    const signedPayment = await signTransaction(
      privateKeyAlice,
      payment,
      network
    )

    const isVerified = client.verifyTransaction(signedPayment)
    expect(isVerified).toBeTruthy()

    const accountProvider = new AccountInfoGraphQLProvider(minaAccountInfoGql)
    const accountInfoArgs: AccountInfoArgs = {
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    }
    const accountInfo = await accountProvider.getAccountInfo(accountInfoArgs)

    const provider = new TxSubmitGraphQLProvider(minaTxSubmitGql)

    const txArgs: SubmitTxArgs = {
      signedTransaction: signedPayment,
      kind: Mina.TransactionKind.PAYMENT,
      transactionDetails: {
        fee: '500000000',
        to: keyPairBob.publicKey,
        from: keyPairAlice.publicKey,
        nonce: Number(accountInfo.nonce),
        memo: 'hello Bob',
        validUntil: '321',
        amount: '7000000000'
      }
    }
    await expect(provider.submitTx(txArgs)).resolves.not.toThrow()
  })

  /* // commented out until send tx works
  it('Alice submits a delegation transaction', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const privateKeyAlice = keyPairAlice.privateKey
    const delegation: TransactionBody = {
      type: 'delegation',
      to: keyPairAlice.publicKey,
      from: keyPairAlice.publicKey,
      fee: Number(500000000),
      nonce: Number(accountInfo.nonce)
    }

    const signedDelegation = await signTransaction(
      privateKeyAlice,
      delegation,
      network
    )

    const isVerified = client.verifyTransaction(signedDelegation)
    expect(isVerified).toBeTruthy()

    const accountProvider = new AccountInfoGraphQLProvider(minaAccountInfoGql)
    const accountInfoArgs: AccountInfoArgs = {
        publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      }
    const accountInfo = await accountProvider.getAccountInfo(
        accountInfoArgs
    )

    const provider = new TxSubmitGraphQLProvider(minaExplorerGql)
    const txArgs: SubmitTxArgs = {
      signedTransaction: signedDelegation,
      kind: Mina.TransactionKind.STAKE_DELEGATION
    } // TODO: maintain the same value from the TransactionBody `type` field
    await expect(provider.submitTx(txArgs)).resolves.not.toThrow()
  })*/
})
