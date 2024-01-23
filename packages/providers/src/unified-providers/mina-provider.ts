import {
  AccountInfo,
  AccountInfoArgs,
  HealthCheckResponse,
  Mina,
  SubmitTxArgs,
  TransactionsByAddressesArgs,
  UnifiedMinaProviderType
} from '@palladxyz/mina-core'

import { createAccountInfoProvider } from './account-info-provider'
import { createChainHistoryProvider } from './chain-history-provider'
import { createDaemonStatusProvider } from './daemon-status-provider'
import { createTxSubmitProvider } from './tx-submit-provider'
import { ProviderConfig } from './types'

export const createMinaProvider = (
  config: ProviderConfig
): UnifiedMinaProviderType => {
  const getAccountInfo = async (args: AccountInfoArgs) => {
    return (await createAccountInfoProvider(config).getAccountInfo(
      args
    )) as Record<string, AccountInfo>
  }

  const getTransactions = async (args: TransactionsByAddressesArgs) => {
    return (await createChainHistoryProvider(config).transactionsByAddresses(
      args
    )) as Mina.TransactionBody[]
  }

  const submitTransaction = async (args: SubmitTxArgs) => {
    return await createTxSubmitProvider(config).submitTx(args)
  }

  const getDaemonStatus = async () => {
    return await createDaemonStatusProvider(config).getDaemonStatus()
  }

  const healthCheckNode = async () => {
    return await createAccountInfoProvider(config).healthCheck()
  }

  const healthCheckArchive = async () => {
    return await createChainHistoryProvider(config).healthCheck()
  }

  const healthCheck = async () => {
    const node = await healthCheckNode()
    let archiveResult: HealthCheckResponse = { ok: true, message: '' }

    if (config.archiveNodeEndpoint) {
      archiveResult = await healthCheckArchive()
    }

    const ok = node.ok && archiveResult.ok
    const messages = [node.message, archiveResult.message]
      .filter((msg) => typeof msg === 'string' && msg)
      .join(' ')

    return {
      ok,
      message: messages
    }
  }

  return {
    getAccountInfo,
    getTransactions,
    submitTransaction,
    getDaemonStatus,
    healthCheck
  }
}
