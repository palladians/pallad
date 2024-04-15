import {
  HealthCheckResponse,
  NodeStatus,
  NodeStatusProvider
} from '@palladxyz/pallad-core'

import { createNodeStatusProvider as mn } from '../mina-node'
import { createNodeStatusProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createNodeStatusProvider = (
  config: ProviderConfig
): NodeStatusProvider => {
  // TODO: make the underlyingProvider creation a util function
  const underlyingProvider =
    config.nodeEndpoint.providerName === 'mina-node'
      ? mn(config.nodeEndpoint.url)
      : ob(config.nodeEndpoint.url)

  const getNodeStatus = async (): Promise<NodeStatus> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return (await underlyingProvider.getNodeStatus()) as NodeStatus
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return await underlyingProvider.healthCheck()
  }

  return {
    getNodeStatus,
    healthCheck
  }
}
