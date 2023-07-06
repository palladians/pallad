import {
  MinaKeyGenerator, Network
} from '@palladxyz/key-generator'
//import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { accountStore, vaultStore } from '@palladxyz/vault'
import { expect, test } from 'vitest'

import { MinaWalletImpl } from '../src/Wallet'

const ACCOUNT_INFO_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'
const CHAIN_HISTORY_PROVIDER_URL = 'https://berkeley.graphql.minaexplorer.com'
const TX_SUBMIT_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let network: Network
  let keyGen: MinaKeyGenerator

  const accountInfoProvider = new AccountInfoGraphQLProvider(
    ACCOUNT_INFO_PROVIDER_URL
  )
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    CHAIN_HISTORY_PROVIDER_URL
  )

  const txSubmitProvider = new TxSubmitGraphQLProvider(TX_SUBMIT_PROVIDER_URL)

  beforeEach(() => {
    network = Network.Mina
    keyGen = new MinaKeyGenerator()
    
    wallet = new MinaWalletImpl(
      accountInfoProvider,
      chainHistoryProvider,
      txSubmitProvider,
      network,
    )
  })

  test('wallet fetches getAccountInfo', async () => {
    const publicKey = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    const accountInfo = await wallet.getAccountInfo(publicKey)

    if (accountInfo === null) {
      throw new Error('Account info is undefined')
    }

    expect(accountInfo.balance).toBeDefined()
    expect(accountInfo.nonce).toBeDefined()
    expect(accountInfo.inferredNonce).toBeDefined()
    expect(accountInfo.delegate).toBeDefined()
    expect(accountInfo.publicKey).toBeDefined()

    // Check Zustand store has updated correctly
    const storeState = accountStore.getState()
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
    const storeState = accountStore.getState()
    console.log('Transactions in Store:', storeState.transactions)
    expect(storeState.transactions).toEqual(transactions)
  })
  test('wallet creates a new wallet', async () => {
    const walletName = 'Test Wallet'
    const accountNumber = 0
    const newWallet = await wallet.createWallet(
      walletName,
      accountNumber
    )

    if (newWallet === null) {
      throw new Error('New wallet is undefined')
    }

    expect(newWallet).toBeDefined()
    expect(newWallet.publicKey).toBeDefined()
    expect(newWallet.mnemonic).toBeDefined()

    // TODO: Check if the new wallet is correctly stored in the vault
    const walletStoreState = vaultStore.getState()
    console.log('Account Info in Store:', walletStoreState)
    //expect(walletStoreState....).toEqual(...)
  })

  test('wallet restores a wallet', async () => {
    const walletName = 'Restored Wallet'
    const mnemonic = 'habit hope tip crystal because grunt nation idea electric witness alert like'
    const accountNumber = 0
    const restoredWallet = await wallet.restoreWallet(
      walletName,
      mnemonic,
      accountNumber
    )

    if (restoredWallet === null) {
      throw new Error('New wallet is undefined')
    }

    expect(restoredWallet).toBeDefined()
    expect(restoredWallet.publicKey).toEqual('B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb')

    // TODO: Check if the restored wallet is correctly stored in the vault

  })

  test('wallet gets the current wallet', async () => {
    const currentWallet = wallet.getCurrentWallet()

    if (currentWallet === null) {
      throw new Error('New wallet is undefined')
    }
    
    expect(currentWallet).toBeDefined()
    expect(currentWallet.walletName).toBeDefined()
    expect(currentWallet.walletPublicKey).toBeDefined()

    // TODO: Check if the current wallet matches the one in the vault
  })
/*
  test('wallet signs a transaction', async () => {
    const walletPublicKey = 'your wallet public key' // use a valid public key for testing
    const transaction = {} // replace this with a ConstructedTransaction object
    const password = 'your password' // use the password for the corresponding wallet
    const signedTransaction = await wallet.signTx(
      walletPublicKey,
      transaction,
      password
    )

    expect(signedTransaction).toBeDefined()

    // TODO: Verify if the transaction is correctly signed
  })*/
})
/*test('wallet submits a transaction', async () => {
    const submitTxArgs: SubmitTxArgs = {} // replace this with a SubmitTxArgs object
    const result = await wallet.submitTx(submitTxArgs)

    expect(result).toBeDefined()

    // TODO: Verify if the transaction is correctly submitted
  })*/
