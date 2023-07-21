import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management-agnostic'
//import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { accountStore, keyAgentStore } from '@palladxyz/vault'
import { expect, test } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import { MinaWalletDependencies, MinaWalletImpl } from '../src/Wallet'

enum providerURLs {
  txSubmitURL = 'https://proxy.devnet.minaexplorer.com/',
  chainHistoryURL = 'https://devnet.graphql.minaexplorer.com',
  accountInfoURL = 'https://proxy.devnet.minaexplorer.com/'
}

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies

  const accountInfoProvider = new AccountInfoGraphQLProvider(
    providerURLs.accountInfoURL
  )
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    providerURLs.chainHistoryURL
  )
  const txSubmitProvider = new TxSubmitGraphQLProvider(providerURLs.txSubmitURL)

  const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
  const mnemonic = [
    'habit',
    'hope',
    'tip',
    'crystal',
    'because',
    'grunt',
    'nation',
    'idea',
    'electric',
    'witness',
    'alert',
    'like'
  ]

  const minaAddresses = [
    'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
    'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'
  ]

  beforeEach(() => {
    walletDependencies = {
      keyAgent: keyAgentStore.getState().keyAgent,
      txSubmitProvider,
      chainHistoryProvider,
      accountInfoProvider
    }
    wallet = new MinaWalletImpl({ name: 'Test Wallet' }, walletDependencies)
  })
  test('wallet fetches getAccountInfo', async () => {
    const publicKey = minaAddresses[0] as string
    // get the account info from the provider
    const accountInfo = await wallet.getAccountInfo(publicKey)
    console.log('Account Info:', accountInfo)
    // set the account info in the store
    wallet.setAccountInfo(accountInfo)

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
    const publicKey = minaAddresses[0] as string
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
  test('wallet restores a wallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, restoreArgs, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    console.log('knownCredentials', storeKeyAgentCredentials)
    expect(storeKeyAgentCredentials).toHaveLength(1)
    console.log('Derived Credentials:', storeKeyAgentCredentials)
  })
})
