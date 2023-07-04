import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { Mina } from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider
} from '@palladxyz/mina-graphql'
import { NetworkType } from '@palladxyz/tx-construction'
import { expect, test } from 'vitest'

import { useStore } from '../src/store'
import { MinaWalletImpl } from '../src/Wallet'

const ACCOUNT_INFO_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'
const CHAIN_HISTORY_PROVIDER_URL = 'https://berkeley.graphql.minaexplorer.com'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let network: NetworkType
  let keyGen: MinaKeyGenerator

  const accountInfoProvider = new AccountInfoGraphQLProvider(
    ACCOUNT_INFO_PROVIDER_URL
  )
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    CHAIN_HISTORY_PROVIDER_URL
  )

  beforeEach(() => {
    network = 'testnet'
    keyGen = new MinaKeyGenerator()
    wallet = new MinaWalletImpl(
      accountInfoProvider,
      chainHistoryProvider,
      network
    )
  })

  test('wallet fetches getAccountInfo', async () => {
    const publicKey = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    const accountInfo = await wallet.getAccountInfo(publicKey)

    expect(accountInfo.balance).toBeDefined()
    expect(accountInfo.nonce).toBeDefined()
    expect(accountInfo.inferredNonce).toBeDefined()
    expect(accountInfo.delegate).toBeDefined()
    expect(accountInfo.publicKey).toBeDefined()

    // Check Zustand store has updated correctly
    const storeState = useStore.getState()
    console.log('Account Info in Store:', storeState.accountInfo)
    expect(storeState.accountInfo).toEqual(accountInfo)
  })

  test('wallet fetches getTransactions', async () => {
    const publicKey = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    const transactions = await wallet.getTransactions(publicKey)

    expect(transactions).toBeDefined()
    expect(transactions.length).toBeLessThanOrEqual(20)

    transactions.forEach((tx) => {
      // Add some checks for the properties that each transaction should have
      expect(tx.amount).toBeDefined()
      expect(tx.blockHeight).toBeDefined()
      expect(tx.dateTime).toBeDefined()
      expect(tx.failureReason).toBeDefined()
      expect(tx.fee).toBeDefined()
      expect(tx.from).toBeDefined()
      expect(tx.hash).toBeDefined()
      expect(tx.isDelegation).toBeDefined()
      expect(tx.kind).toBeDefined()
      expect(tx.to).toBeDefined()
      expect(tx.token).toBeDefined()
    })
    // Check Zustand store has updated correctly
    const storeState = useStore.getState()
    console.log('Transactions in Store:', storeState.transactions)
    expect(storeState.transactions).toEqual(transactions)
  })

  test('construct and sign a payment transaction', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const keyGen = KeyGeneratorFactory.create(Network.Mina)
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)

    const payment: Mina.TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: '1',
      nonce: '0',
      memo: 'hello Bob',
      validUntil: '321',
      amount: '100'
    }

    const constructedPayment = await wallet.constructTx(
      payment,
      Mina.TransactionKind.PAYMENT
    )
    const signedPayment = await wallet.signTx(
      keyPairAlice.privateKey,
      constructedPayment
    )

    expect(signedPayment).toBeDefined()
    expect(signedPayment.signature).toBeDefined()
  })

  test('construct and sign a delegation transaction', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)

    const delegation: Mina.TransactionBody = {
      type: 'delegation',
      to: keyPairAlice.publicKey,
      from: keyPairAlice.publicKey,
      fee: '1',
      nonce: '0'
    }

    const constructedDelegation = await wallet.constructTx(
      delegation,
      Mina.TransactionKind.STAKE_DELEGATION
    )
    const signedDelegation = await wallet.signTx(
      keyPairAlice.privateKey,
      constructedDelegation
    )

    expect(signedDelegation).toBeDefined()
    expect(signedDelegation.signature).toBeDefined()
  })

  // TODO: Add more tests for other functionality when implemented
})
