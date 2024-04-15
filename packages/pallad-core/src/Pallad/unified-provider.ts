import { AccountInfo, AccountInfoArgs } from './account-info-provider'
import {
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs
} from './chain-history-provider'
import { NodeStatus } from './node-status-provider'
import { HealthCheckResponse } from './provider'
import { TxStatus, TxStatusArgs } from './tx-status-provider'
import { SubmitTxArgs, SubmitTxResult } from './tx-submit-provider'
import { Tx } from './types'

export type UnifiedChainProviderConfig = {
  nodeUrl: string
  archiveUrl: string
}

export interface UnifiedChainProviderType {
  changeNetwork?(nodeUrl: string, archiveUrl: string): Promise<void>
  destroy?(): Promise<void>

  // Methods related to ProviderNode
  getAccountInfo(
    args: AccountInfoArgs
  ): Promise<Record<string, AccountInfo> | undefined>
  getTransactionStatus?(args: TxStatusArgs): Promise<TxStatus | undefined>
  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult | undefined>

  // Methods related to ProviderArchive
  getTransactions(args: TransactionsByAddressesArgs): Promise<Tx[] | undefined>
  getTransaction?(args: TransactionsByHashesArgs): Promise<Tx[] | undefined>

  getNodeStatus(): Promise<NodeStatus>

  // healthCheck
  healthCheck(): Promise<HealthCheckResponse>

  provider?: UnifiedChainProviderConfig
}
