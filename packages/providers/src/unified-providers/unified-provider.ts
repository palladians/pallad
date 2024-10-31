import type {
  AccountInfo,
  AccountInfoArgs,
  HealthCheckResponse,
  TransactionsByAddressesArgs,
  Tx,
  UnifiedChainProviderType,
} from "@palladxyz/pallad-core"

import { createAccountInfoProvider } from "./account-info-provider"
import { createChainHistoryProvider } from "./chain-history-provider"
import { createNodeStatusProvider } from "./node-status-provider"
import type { ProviderConfig } from "./types"

export const createChainProvider = (
  config: ProviderConfig,
): UnifiedChainProviderType => {
  const getAccountInfo = async (args: AccountInfoArgs) => {
    return (await createAccountInfoProvider(config).getAccountInfo(
      args,
    )) as Record<string, AccountInfo>
  }

  const getTransactions = async (args: TransactionsByAddressesArgs) => {
    return (await createChainHistoryProvider(config).transactionsByAddresses(
      args,
    )) as Tx[]
  }

  const getNodeStatus = async () => {
    return await createNodeStatusProvider(config).getNodeStatus()
  }

  const healthCheckNode = async () => {
    return await createAccountInfoProvider(config).healthCheck()
  }

  const healthCheckArchive = async () => {
    return await createChainHistoryProvider(config).healthCheck()
  }

  const healthCheck = async () => {
    const node = await healthCheckNode()
    let archiveResult: HealthCheckResponse = { ok: true, message: "" }

    if (config.archiveNodeEndpoint) {
      archiveResult = await healthCheckArchive()
    }

    const ok = node.ok && archiveResult.ok
    const messages = [node.message, archiveResult.message]
      .filter((msg) => typeof msg === "string" && msg)
      .join(" ")

    return {
      ok,
      message: messages,
    }
  }

  return {
    getAccountInfo,
    getTransactions,
    getNodeStatus,
    healthCheck,
  }
}
