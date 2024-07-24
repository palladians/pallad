import type {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
} from "@palladxyz/pallad-core"

import { createAccountInfoProvider as mn } from "../mina-node"
import type { ProviderConfig } from "./types"

export const createAccountInfoProvider = (
  config: ProviderConfig,
): AccountInfoProvider => {
  // TODO: make the underlyingProvider creation a util function
  const underlyingProvider = mn(config.nodeEndpoint.url)

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
