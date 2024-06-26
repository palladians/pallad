import type {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
} from "@palladxyz/pallad-core"

import { createAccountInfoProvider as mn } from "../mina-node"
import { createAccountInfoProvider as ob } from "../obscura-provider"
import { createAccountInfoProvider as op } from "../optimism"
import type { ProviderConfig } from "./types"

export const createAccountInfoProvider = (
  config: ProviderConfig,
): AccountInfoProvider => {
  // TODO: make the underlyingProvider creation a util function
  let underlyingProvider: AccountInfoProvider
  if (config.nodeEndpoint.providerName === "mina-node") {
    underlyingProvider = mn(config.nodeEndpoint.url)
  } else if (config.nodeEndpoint.providerName === "obscura") {
    underlyingProvider = ob(config.nodeEndpoint.url)
  } else {
    underlyingProvider = op(config.nodeEndpoint.url)
  }

  const getAccountInfo = async (
    args: AccountInfoArgs,
  ): Promise<Record<string, AccountInfo>> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return (await underlyingProvider.getAccountInfo(args)) as Record<
      string,
      AccountInfo
    >
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return await underlyingProvider.healthCheck()
  }

  return {
    getAccountInfo,
    healthCheck,
  }
}
