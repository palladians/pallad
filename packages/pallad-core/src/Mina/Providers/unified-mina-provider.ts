import { Mina } from '@palladxyz/mina-core'

import { AccountInfo, AccountInfoArgs } from './account-info-provider'
import {
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from './chain-history-provider'
import { DaemonStatus } from './daemon-status-provider'
import { HealthCheckResponse } from './provider'
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
  ):
    | Promise<AccountInfo | undefined>
    | Promise<Record<string, AccountInfo> | undefined>
  getTransactionStatus?(args: TxStatusArgs): Promise<TxStatus | undefined>
  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult | undefined>

  // Methods related to ProviderArchive
  getTransactions(
    args: TransactionsByAddressesArgs
  ):
    | Promise<Mina.Paginated<Mina.TransactionBody> | undefined>
    | Promise<Mina.TransactionBody[] | undefined>
  getTransaction?(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[] | undefined>

  getDaemonStatus?(): Promise<DaemonStatus>

  // healthCheck
  healthCheck?(): Promise<HealthCheckResponse>

  provider?: UnifiedMinaProviderType
}
