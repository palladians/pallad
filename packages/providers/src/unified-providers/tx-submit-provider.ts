import {
  HealthCheckResponse,
  SubmitTxArgs,
  SubmitTxResult,
  TxSubmitProvider
} from '@palladxyz/mina-core'

import { createTxSubmitProvider as me } from '../mina-explorer'
import { createTxSubmitProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createTxSubmitProvider = (
  config: ProviderConfig
): TxSubmitProvider => {
  const underlyingProvider =
    config.providerName === 'mina-explorer'
      ? me(config.archiveUrl || config.url)
      : ob(config.archiveUrl || config.url)

  const submitTx = async (args: SubmitTxArgs): Promise<SubmitTxResult> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return await underlyingProvider.submitTx(args)
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    submitTx,
    healthCheck
  }
}
