import { TransactionBody } from '../Mina'
import { AccountInfo, AccountInfoArgs } from './account-info-provider'
import {
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from './chain-history-provider'
import { DaemonStatus } from './daemon-status-provider'
import { HealthCheckResponse } from './Provider'
import { TxStatus, TxStatusArgs } from './tx-status-provider'
import { SubmitTxArgs, SubmitTxResult } from './tx-submit-provider'

export type UnifiedMinaProviderConfig = {
  nodeUrl: string
  archiveUrl: string
}

export interface UnifiedMinaProviderType {
  changeNetwork?(nodeUrl: string, archiveUrl: string): Promise<void>
  destroy?(): Promise<void>

  // Methods related to ProviderNode
  getAccountInfo(
    args: AccountInfoArgs
  ): Promise<Record<string, AccountInfo> | undefined>
  getTransactionStatus?(args: TxStatusArgs): Promise<TxStatus | undefined>
  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult | undefined>

  // Methods related to ProviderArchive
  getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<TransactionBody[] | undefined>
  getTransaction?(
    args: TransactionsByIdsArgs
  ): Promise<TransactionBody[] | undefined>

  getDaemonStatus?(): Promise<DaemonStatus>

  // healthCheck
  healthCheck?(): Promise<HealthCheckResponse>

  provider?: UnifiedMinaProviderType
}
