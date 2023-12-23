import { Paginated, TransactionBody } from '../Mina'
import { AccountInfo, AccountInfoArgs } from './AccountInfoProvider'
import {
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from './ChainHistoryProvider'
import { DaemonStatus } from './DaemonStatusProvider'
import { TxStatus, TxStatusArgs } from './TxStatusProvider'
import { SubmitTxArgs, SubmitTxResult } from './TxSubmitProvider'

export type UnifiedMinaProviderConfig = {
  nodeUrl: string
  archiveUrl: string
}

export interface UnifiedMinaProviderType {
  changeNetwork(nodeUrl: string, archiveUrl: string): Promise<void>
  destroy(): Promise<void>

  // Methods related to ProviderNode
  getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo | undefined>
  getTransactionStatus(args: TxStatusArgs): Promise<TxStatus | undefined>
  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult | undefined>
  getDaemonStatus(): Promise<DaemonStatus | undefined>

  // Methods related to ProviderArchive
  getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Paginated<TransactionBody> | undefined>
  getTransaction(
    args: TransactionsByIdsArgs
  ): Promise<TransactionBody[] | undefined>

  provider: UnifiedMinaProviderType
}
