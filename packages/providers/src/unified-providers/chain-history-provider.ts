import {
  ChainHistoryProvider,
  HealthCheckResponse,
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs,
  Tx
} from '@palladxyz/pallad-core'

import { createChainHistoryProvider as mn } from '../mina-node'
import { createChainHistoryProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createChainHistoryProvider = (
  config: ProviderConfig
): ChainHistoryProvider => {
  // TODO: make the underlyingProvider creation a util function
  const underlyingProvider =
    config.nodeEndpoint.providerName === 'mina-node'
      ? mn(config.archiveNodeEndpoint.url)
      : ob(config.archiveNodeEndpoint.url)

  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Tx[]> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return await underlyingProvider.transactionsByAddresses(args)
  }

  const transactionsByHashes = async (
    args: TransactionsByHashesArgs
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
    healthCheck
  }
}
