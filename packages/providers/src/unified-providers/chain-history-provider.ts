import type {
  ChainHistoryProvider,
  HealthCheckResponse,
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs,
  Tx,
} from "@palladco/pallad-core"

import { createChainHistoryProvider as ms } from "../blockberry-provider"
import { createChainHistoryProvider as zs } from "../zeko-scan"

import type { ProviderConfig } from "./types"

export const createChainHistoryProvider = (
  config: ProviderConfig,
): ChainHistoryProvider => {
  // TODO: make the underlyingProvider creation a util function
  let underlyingProvider: ChainHistoryProvider
  if (config.archiveNodeEndpoint.providerName === "mina-scan") {
    underlyingProvider = ms(config.archiveNodeEndpoint.url)
  } else if (config.archiveNodeEndpoint.providerName === "zeko-scan") {
    underlyingProvider = zs(config.archiveNodeEndpoint.url)
  }

  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs,
  ): Promise<Tx[]> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return await underlyingProvider.transactionsByAddresses(args)
  }

  const transactionsByHashes = async (
    args: TransactionsByHashesArgs,
  ): Promise<Tx[]> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return await underlyingProvider.transactionsByHashes(args)
  }

  const healthCheck = (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    transactionsByAddresses,
    transactionsByHashes,
    healthCheck,
  }
}
