import { Network } from '@palladxyz/key-generator'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs
} from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import {
  ConstructedTransaction,
  constructTransaction,
  SignedTransaction,
  signTransaction
} from '@palladxyz/tx-construction'
import { accountStore, PublicCredential, vaultStore } from '@palladxyz/vault'

import { MinaWallet } from '../types'

export class MinaWalletImpl implements MinaWallet {
  private accountProvider: AccountInfoGraphQLProvider
  private chainHistoryProvider: ChainHistoryGraphQLProvider
  private transactionSubmissionProvider: TxSubmitGraphQLProvider
  //private networkType: NetworkType
  private network: Network
  // Storage for the current wallet

  constructor(
    accountProvider: AccountInfoGraphQLProvider,
    chainHistoryProvider: ChainHistoryGraphQLProvider,
    transactionSubmissionProvider: TxSubmitGraphQLProvider,
    network: Network
  ) {
    this.accountProvider = accountProvider
    this.chainHistoryProvider = chainHistoryProvider
    this.transactionSubmissionProvider = transactionSubmissionProvider
    this.network = network
  }

  async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo> {
    const accountInfo = await this.accountProvider.getAccountInfo({ publicKey })
    accountStore.getState().setAccountInfo(accountInfo)
    return accountInfo
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
    const credential = vaultStore.getState().credentials[0]
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
    const result = await this.transactionSubmissionProvider.submitTx(
      submitTxArgs
    )
    return result
  }

  async createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null> {
    // Create a new wallet
    const result = await vaultStore.getState().createWallet({
      walletName,
      network: this.network,
      accountNumber
    })

    // Return the public key and mnemonic or null
    return result
      ? { publicKey: result.publicKey, mnemonic: result.mnemonic }
      : null
  }

  async restoreWallet(
    walletName: string,
    mnemonic: string,
    accountNumber: number
  ): Promise<{ publicKey: string } | null> {
    // Restore a wallet from a mnemonic
    const result = await vaultStore.getState().restoreWallet({
      walletName,
      network: this.network,
      mnemonic,
      accountNumber
    })
    return result ? { publicKey: result.publicKey } : null
  }

  getCurrentWallet(): PublicCredential | null {
    // Get the current wallet
    const result = vaultStore.getState().getCurrentWallet()

    // Return the public credential or null
    return result ? result : null
  }

  getAccounts(): string[] {
    // Get the list of accounts for the current wallet
    const result = vaultStore.getState().getAccounts()

    // Return the list of accounts
    return result
  }

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
