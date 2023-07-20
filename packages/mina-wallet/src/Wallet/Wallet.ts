import {
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  Network
} from '@palladxyz/key-management'
import {
  AccountInfo,
  AccountInfoArgs,
  Mina,
  //SubmitTxArgs,
  //SubmitTxResult,
  TransactionsByAddressesArgs
} from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { accountStore, keyAgentStore, NetworkArgs } from '@palladxyz/vault'

import { MinaWallet } from '../types'
/*
enum providerURLs {
  txSubmitURL = 'https://proxy.devnet.minaexplorer.com/',
  chainHistoryURL = 'https://devnet.graphql.minaexplorer.com',
  accountInfoURL = 'https://proxy.devnet.minaexplorer.com/'
}*/

export interface MinaWalletDependencies {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly txSubmitProvider: TxSubmitGraphQLProvider
  readonly chainHistoryProvider: ChainHistoryGraphQLProvider
  readonly accountInfoProvider: AccountInfoGraphQLProvider
  readonly network: Network
  //readonly stores?: WalletStores;
}

export interface MinaWalletProps {
  readonly name: string
}

export class MinaWalletImpl implements MinaWallet {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly balance: number
  readonly credentials: GroupedCredentials[]
  readonly accountInfoProvider: AccountInfoGraphQLProvider
  readonly chainHistoryProvider: ChainHistoryGraphQLProvider
  readonly txSubmitProvider: TxSubmitGraphQLProvider
  readonly name: string
  //readonly networkType: NetworkType
  readonly network: Network
  // Storage for the current wallet

  constructor(
    { name }: MinaWalletProps,
    {
      keyAgent,
      txSubmitProvider,
      chainHistoryProvider,
      accountInfoProvider,
      network
    }: //stores = createInMemoryWalletStores()
    MinaWalletDependencies
  ) {
    this.accountInfoProvider = accountInfoProvider //new AccountInfoGraphQLProvider(providerURLs.accountInfoURL)
    this.chainHistoryProvider = chainHistoryProvider //new ChainHistoryGraphQLProvider(providerURLs.chainHistoryURL)
    this.txSubmitProvider = txSubmitProvider //new TxSubmitGraphQLProvider(providerURLs.txSubmitURL)
    this.keyAgent = keyAgent
    this.name = name
    this.network = network
    this.credentials = []
    this.balance = 0
  }

  //getName(): Promise<string> {
  //  throw new Error('Method not implemented.')
  //}

  async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo> {
    // perform a health check
    const health = await this.accountInfoProvider.healthCheck()
    console.log('Health check:', health)
    if (!health) {
      throw new Error('Health check failed')
    }

    const accountInfoArgs: AccountInfoArgs = { publicKey: publicKey }
    const accountInfo = await this.accountInfoProvider.getAccountInfo(
      accountInfoArgs
    )
    return accountInfo
  }

  setAccountInfo(accountInfo: AccountInfo): void {
    accountStore.getState().setAccountInfo(accountInfo)
  }

  async getTransactions(
    publicKey: Mina.PublicKey
  ): Promise<Mina.TransactionBody[]> {
    const limit = 10
    let startAt = 0
    let transactions: Mina.TransactionBody[] = []

    while (transactions.length < 20) {
      const args: TransactionsByAddressesArgs = {
        addresses: [publicKey],
        pagination: { startAt, limit }
      }

      const transactionPage =
        await this.chainHistoryProvider.transactionsByAddresses(args)

      transactions = [...transactions, ...transactionPage.pageResults]

      if (
        transactionPage.pageResults.length < limit ||
        transactions.length >= 20
      ) {
        break
      }

      startAt += limit
    }

    transactions = transactions.slice(0, 20)

    accountStore.getState().setTransactions(transactions)

    return transactions
  }
  /*
  async constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction> {
    const constructedTransaction: ConstructedTransaction = constructTransaction(
      transaction,
      kind
    )
    return constructedTransaction
  }

  async signTx(
    transaction: ConstructedTransaction
  ): Promise<SignedTransaction> {
    const credential = keyAgentStore.getState().credentials[0]
    const privateKey = credential?.walletPrivateKey
    if (privateKey === undefined) {
      throw new Error('Private key is undefined')
    }

    const signedTransaction: SignedTransaction = await signTransaction(
      privateKey,
      transaction,
      'testnet' // TODO: Define Mina NetworkType which is either 'testnet' or 'mainnet' and include in the vault
    )

    // TODO: Verify that the transaction is valid before returning it
    return signedTransaction
  }

  async submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult> {
    const result = await this.txSubmitProvider.submitTx(submitTxArgs)
    return result
  }

  async createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null> {
    // Create a new wallet
    const result = await keyAgentStore.getState().createWallet({
      walletName,
      network: this.network,
      accountNumber
    })

    // Return the public key and mnemonic or null
    return result
      ? { publicKey: result.publicKey, mnemonic: result.mnemonic }
      : null
  }*/

  async restoreWallet(
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    { network, networkType }: NetworkArgs
  ): Promise<InMemoryKeyAgent | null> {
    // Restore a wallet from a mnemonic
    const keyAgent = await keyAgentStore.getState().restoreWallet(
      {
        mnemonicWords,
        getPassphrase
      },
      { network, networkType }
    )
    return keyAgent ? keyAgent : null
  }
  /*
  getCurrentWallet(): PublicCredential | null {
    // Get the current wallet
    const result = keyAgentStore.getState().getCurrentWallet()

    // Return the public credential or null
    return result ? result : null
  }

  getAccounts(): string[] {
    // Get the list of accounts for the current wallet
    const result = keyAgentStore.getState().getAccounts()

    // Return the list of accounts
    return result
  }*/

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
