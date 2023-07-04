import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { AccountInfoArgs, Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  getSignClient,
  NetworkType,
  signTransaction
} from '@palladxyz/tx-construction'
import Client from 'mina-signer'
import { expect } from 'vitest'

import { AccountInfoGraphQLProvider } from '../../src/Providers/AccountInfo'
import { TxSubmitGraphQLProvider } from '../../src/Providers/TxSubmit/TxSubmitProvider'
// TO DO: create end-to-end suite with a local-network
const minaTxSubmitGql = 'https://proxy.berkeley.minaexplorer.com/' // Needs a different API than the explorer
const minaAccountInfoGql = 'https://proxy.berkeley.minaexplorer.com/' // Needs a different API than the explorer

/**
 *
 * This test submtis a transaction to the Mina testnet (Berkley) using the TxSubmitGraphQLProvider
 * NOTE: Changes are required for being able to submit a transaction to the mainnet
 */

describe('TxSubmitGraphQLProvider for Testnet', () => {
  // Variables used across multiple tests
  let keyGen: MinaKeyGenerator
  let mnemonic: string
  let client: Client
  let network: NetworkType

  // Test to check if the provider health check function works as expected
  test('healthCheck', async () => {
    const provider = new TxSubmitGraphQLProvider(minaTxSubmitGql)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })

  // Set up the network, client, key generator and mnemonic for every test
  beforeEach(async () => {
    keyGen = new MinaKeyGenerator()
    network = 'testnet' // Set network to 'testnet'
    client = await getSignClient(network) // Client for the 'testnet'
    mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like' // Test mnemonic
  })

  // This test checks if the key generator instance is correctly created
  it('should create a MinaKeyGenerator instance for Mina network', () => {
    const keyGen = KeyGeneratorFactory.create(Network.Mina)
    expect(keyGen).toBeInstanceOf(MinaKeyGenerator)
  })

  // This test checks if the correct wallet data is returned for a known mnemonic
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

  // This test checks if a payment transaction from Alice to Bob is correctly constructed and signed
  it('Alice should construct & sign a payment transaction correctly to Bob', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const privateKeyAlice = keyPairAlice.privateKey
    const payment: Mina.TransactionBody = {
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

  // This test checks if a delegation transaction is correctly constructed and signed
  it('Alice should construct & sign a delegation transaction correctly', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const privateKeyAlice = keyPairAlice.privateKey
    const delegation: Mina.TransactionBody = {
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

  // This test checks if a payment transaction from Alice to Bob can be submitted without any errors
  it('Alice submits a payment transaction to Bob', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const privateKeyAlice = keyPairAlice.privateKey

    const accountProvider = new AccountInfoGraphQLProvider(minaAccountInfoGql)
    const accountInfoArgs: AccountInfoArgs = {
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    }
    const accountInfo = await accountProvider.getAccountInfo(accountInfoArgs)

    // Check if accountInfo.nonce is appropriately incremented, there may be transactions pending
    // in the wallet we will need conditions for checking if there is a pending transaction
    // and for checking if a send transaction is in-flight-pending/successful

    const payment: Mina.TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: 150000000,
      nonce: Number(accountInfo.nonce),
      memo: 'hello Bob',
      amount: 3000000000,
      validUntil: 4294967295
    }

    const signedPayment = await signTransaction(
      privateKeyAlice,
      payment,
      network
    )

    const isVerified = client.verifyTransaction(signedPayment)
    expect(isVerified).toBeTruthy()

    const submitTxProvider = new TxSubmitGraphQLProvider(minaTxSubmitGql)

    const txArgs: SubmitTxArgs = {
      signedTransaction: signedPayment,
      kind: Mina.TransactionKind.PAYMENT,
      transactionDetails: {
        fee: payment.fee,
        to: payment.to,
        from: payment.from,
        nonce: payment.nonce,
        memo: payment.memo,
        validUntil: payment.validUntil,
        amount: payment.amount
      }
    }

    await expect(submitTxProvider.submitTx(txArgs)).resolves.not.toThrow()
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
      nonce: String(accountInfo.nonce), // must be current nonce + 1
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

    const submitTxProvider = new TxSubmitGraphQLProvider(minaExplorerGql)
    const txArgs: SubmitTxArgs = {
      signedTransaction: signedDelegation,
      kind: Mina.TransactionKind.STAKE_DELEGATION
    } // TODO: maintain the same value from the TransactionBody `type` field
    await expect(submitTxProvider.submitTx(txArgs)).resolves.not.toThrow()
  })*/
})
