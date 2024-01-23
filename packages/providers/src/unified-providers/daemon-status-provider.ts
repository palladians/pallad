import {
  DaemonStatus,
  DaemonStatusProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'

import { createDaemonStatusProvider as me } from '../mina-explorer'
import { createDaemonStatusProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createDaemonStatusProvider = (
  config: ProviderConfig
): DaemonStatusProvider => {
  const underlyingProvider =
    config.nodeEndpoint.providerName === 'mina-explorer'
      ? me(config.nodeEndpoint.url)
      : ob(config.nodeEndpoint.url)

  const getDaemonStatus = async (): Promise<DaemonStatus> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return (await underlyingProvider.getDaemonStatus()) as DaemonStatus
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return await underlyingProvider.healthCheck()
  }

  return {
    getDaemonStatus,
    healthCheck
  }
}
