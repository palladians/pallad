import {
  AccountInfo,
  AccountInfoArgs,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from './AccountInfo'
import { ChainHistoryGraphQLProvider } from './ChainHistory'
import { TxStatusGraphQLProvider } from './TxStatus'
import { TxSubmitGraphQLProvider } from './TxSubmit'
import { Provider } from './types'

export class MinaProvider implements Provider {
  private accountInfoProvider: AccountInfoGraphQLProvider
  private chainHistoryProvider: ChainHistoryGraphQLProvider
  private txSubmitProvider: TxSubmitGraphQLProvider
  private txStatusProvider: TxStatusGraphQLProvider

  constructor(nodeUrl: string, explorerUrl: string) {
    this.accountInfoProvider = new AccountInfoGraphQLProvider(nodeUrl)
    this.chainHistoryProvider = new ChainHistoryGraphQLProvider(explorerUrl)
    this.txSubmitProvider = new TxSubmitGraphQLProvider(nodeUrl)
    this.txStatusProvider = new TxStatusGraphQLProvider(nodeUrl)
  }

  public get provider(): this {
    return this
  }

  public async destroy(): Promise<void> {
    // Here you should destroy resources based on your providers.
    throw new Error('Method not implemented.')
  }

  public async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    return this.accountInfoProvider.getAccountInfo(args)
  }

  public async getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>> {
    return this.chainHistoryProvider.transactionsByAddresses(args)
  }

  public async getTransaction(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> {
    return this.chainHistoryProvider.transactionsByHashes(args)
  }

  public async getTransactionStatus(args: TxStatusArgs): Promise<TxStatus> {
    return this.txStatusProvider.checkTxStatus(args)
  }

  public async submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult> {
    return this.txSubmitProvider.submitTx(args)
  }
}
