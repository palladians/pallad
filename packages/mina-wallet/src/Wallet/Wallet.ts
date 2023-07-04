import {
  AccountInfo,
  Mina,
  TransactionsByAddressesArgs
} from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider
} from '@palladxyz/mina-graphql'
import {
  ConstructedTransaction,
  constructTransaction,
  NetworkType,
  SignedTransaction,
  signTransaction
} from '@palladxyz/tx-construction'

import { useStore } from '../store'
import { MinaWallet } from '../types'

export class MinaWalletImpl implements MinaWallet {
  private accountProvider: AccountInfoGraphQLProvider
  private chainHistoryProvider: ChainHistoryGraphQLProvider
  private network: NetworkType
  //private transactionSubmissionProvider: TxSubmitProvider;

  constructor(
    accountProvider: AccountInfoGraphQLProvider,
    chainHistoryProvider: ChainHistoryGraphQLProvider,
    network: NetworkType
  ) {
    this.accountProvider = accountProvider
    this.chainHistoryProvider = chainHistoryProvider
    this.network = network
    //this.transactionSubmissionProvider = transactionSubmissionProvider;
  }

  async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo> {
    const accountInfo = await this.accountProvider.getAccountInfo({ publicKey })
    useStore.getState().setAccountInfo(accountInfo)
    return accountInfo
  }

  async getTransactions(
    publicKey: Mina.PublicKey
  ): Promise<Mina.TransactionBody[]> {
    const limit = 10 // Number of transactions per page
    let startAt = 0 // Starting point for the next page of data
    let transactions: Mina.TransactionBody[] = [] // Holds all transactions across all pages

    while (transactions.length < 20) {
      const args: TransactionsByAddressesArgs = {
        addresses: [publicKey],
        pagination: { startAt, limit }
      }

      const transactionPage =
        await this.chainHistoryProvider.transactionsByAddresses(args)

      transactions = [...transactions, ...transactionPage.pageResults]

      // If the number of transactions returned is less than the limit, then it means we have fetched all transactions
      // or if we've already fetched 20 transactions, we stop
      if (
        transactionPage.pageResults.length < limit ||
        transactions.length >= 20
      ) {
        break
      }

      // Update the startAt for the next iteration
      startAt += limit
    }

    // Trim transactions array to only first 20 elements
    transactions = transactions.slice(0, 20)

    useStore.getState().setTransactions(transactions)

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
    privateKey: string,
    transaction: ConstructedTransaction
  ): Promise<SignedTransaction> {
    const signedTransaction: SignedTransaction = await signTransaction(
      privateKey,
      transaction,
      this.network
    )
    return signedTransaction
  }

  /*
    async submitTx(signedTransaction: SignedTransaction): Promise<SubmitTxResult> {
      // Implement the logic to submit a transaction
      // Once the transaction is successful, update the balance and transaction history
      const result = await this.transactionSubmissionProvider.submitTx(signedTransaction);
      if (result.isSuccessful) {
        await this.balance;
        await this.transactions;
      }
      return result;
    }
    */

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
