import {
  HealthCheckResponse,
  SubmitTxArgs,
  SubmitTxResult,
  TxSubmitProvider
} from '@palladxyz/mina-core'

import { createTxSubmitProvider as mn } from '../mina-node'
import { createTxSubmitProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createTxSubmitProvider = (
  config: ProviderConfig
): TxSubmitProvider => {
  const underlyingProvider =
    config.nodeEndpoint.providerName === 'mina-node'
      ? mn(config.nodeEndpoint.url)
      : ob(config.nodeEndpoint.url)

  const submitTx = async (args: SubmitTxArgs): Promise<SubmitTxResult> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return await underlyingProvider.submitTx(args)
  }

  const healthCheck = (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    submitTx,
    healthCheck
  }
}
