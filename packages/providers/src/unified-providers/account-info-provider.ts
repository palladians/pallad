import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'

import { createAccountInfoProvider as me } from '../mina-explorer'
import { createAccountInfoProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createAccountInfoProvider = (
  config: ProviderConfig
): AccountInfoProvider => {
  const underlyingProvider =
    config.nodeEndpoint.providerName === 'mina-explorer'
      ? me(config.nodeEndpoint.url)
      : ob(config.nodeEndpoint.url)

  const getAccountInfo = async (
    args: AccountInfoArgs
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
    healthCheck
  }
}
