import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { NetworkType } from '@palladxyz/tx-construction'
import { useStore, VaultStore } from '@palladxyz/vault'
import { expect, test } from 'vitest'

import { MinaWalletImpl } from '../src/Wallet'

const ACCOUNT_INFO_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'
const CHAIN_HISTORY_PROVIDER_URL = 'https://berkeley.graphql.minaexplorer.com'
const TX_SUBMIT_PROVIDER_URL = 'https://proxy.berkeley.minaexplorer.com/'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let network: NetworkType
  let keyGen: MinaKeyGenerator
  let vaultStoreMock: VaultStore

  const accountInfoProvider = new AccountInfoGraphQLProvider(
    ACCOUNT_INFO_PROVIDER_URL
  )
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    CHAIN_HISTORY_PROVIDER_URL
  )

  const txSubmitProvider = new TxSubmitGraphQLProvider(TX_SUBMIT_PROVIDER_URL)

  beforeEach(() => {
    network = 'testnet'
    keyGen = new MinaKeyGenerator()
    vaultStoreMock = new VaultStore() // mock implementation
    wallet = new MinaWalletImpl(
      accountInfoProvider,
      chainHistoryProvider,
      txSubmitProvider,
      vaultStoreMock
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
  test('wallet creates a new wallet', async () => {
    const walletName = 'Test Wallet'
    const accountNumber = 0
    const newWallet = await wallet.createWallet(walletName, network, accountNumber)

    expect(newWallet).toBeDefined()
    expect(newWallet.publicKey).toBeDefined()
    expect(newWallet.mnemonic).toBeDefined()

    // TODO: Check if the new wallet is correctly stored in the vault
  })

  test('wallet restores a wallet', async () => {
    const walletName = 'Restored Wallet'
    const mnemonic = 'your test mnemonic' // use a valid mnemonic for testing
    const accountNumber = 0
    const restoredWallet = await wallet.restoreWallet(walletName, network, mnemonic, accountNumber)

    expect(restoredWallet).toBeDefined()
    expect(restoredWallet.publicKey).toBeDefined()

    // TODO: Check if the restored wallet is correctly stored in the vault
  })

  test('wallet gets the current wallet', async () => {
    const currentWallet = wallet.getCurrentWallet()

    expect(currentWallet).toBeDefined()
    expect(currentWallet.walletName).toBeDefined()
    expect(currentWallet.walletPublicKey).toBeDefined()

    // TODO: Check if the current wallet matches the one in the vault
  })

  test('wallet gets all accounts', async () => {
    const accounts = wallet.getAccounts()

    expect(accounts).toBeDefined()
    expect(accounts.length).toBeGreaterThan(0)

    // TODO: Check if the returned accounts match the ones in the vault
  })

  test('wallet signs a transaction', async () => {
    const walletPublicKey = 'your wallet public key' // use a valid public key for testing
    const transaction = {} // replace this with a ConstructedTransaction object
    const password = 'your password' // use the password for the corresponding wallet
    const signedTransaction = await wallet.signTx(walletPublicKey, transaction, password)

    expect(signedTransaction).toBeDefined()

    // TODO: Verify if the transaction is correctly signed
  })

  /*test('wallet submits a transaction', async () => {
    const submitTxArgs: SubmitTxArgs = {} // replace this with a SubmitTxArgs object
    const result = await wallet.submitTx(submitTxArgs)

    expect(result).toBeDefined()

    // TODO: Verify if the transaction is correctly submitted
  })*/
/*
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

  test('Alice should construct, sign, and submit a transaction to Bob via the network', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const storeState = useStore.getState()
    const nonce = storeState.accountInfo.nonce
    const payment: Mina.TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: 150000000,
      nonce: Number(nonce),
      memo: 'hello Bob from wallet',
      amount: 3000000000,
      validUntil: 4294967295
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
    console.log('txArgs', txArgs)
    // commented out until local testnet implemented
    //const txResult = await wallet.submitTx(txArgs)
    //console.log('txResult', txResult)
  })
*/
  // TODO: Add more tests for other functionality when implemented
})
