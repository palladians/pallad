import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider
} from '@palladxyz/mina-graphql'

import { useStore } from '../src/store'
import { MinaWalletImpl } from '../src/Wallet'

const ACCOUNT_INFO_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'
const CHAIN_HISTORY_PROVIDER_URL = 'https://berkeley.graphql.minaexplorer.com'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  const accountInfoProvider = new AccountInfoGraphQLProvider(
    ACCOUNT_INFO_PROVIDER_URL
  )
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    CHAIN_HISTORY_PROVIDER_URL
  )

  beforeEach(() => {
    wallet = new MinaWalletImpl(accountInfoProvider, chainHistoryProvider)
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

  // TODO: Add more tests for other functionality when implemented
})
