import {
  ChainHistoryProvider,
  HealthCheckResponse,
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs,
  Tx
} from '@palladxyz/pallad-core'

import { createChainHistoryProvider as mn } from '../mina-node'
import { createChainHistoryProvider as ob } from '../obscura-provider'
import { createChainHistoryProvider as op } from '../optimism'
import { ProviderConfig } from './types'

export const createChainHistoryProvider = (
  config: ProviderConfig
): ChainHistoryProvider => {
  // TODO: make the underlyingProvider creation a util function
  let underlyingProvider: ChainHistoryProvider
  if (config.nodeEndpoint.providerName === 'mina-node') {
    underlyingProvider = mn(config.archiveNodeEndpoint.url)
  } else if (config.nodeEndpoint.providerName === 'obscura') {
    underlyingProvider = ob(config.archiveNodeEndpoint.url)
  } else {
    underlyingProvider = op(config.archiveNodeEndpoint.url)
  }

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
