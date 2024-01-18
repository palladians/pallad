import {
  ChainHistoryProvider,
  HealthCheckResponse,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { createChainHistoryProvider as me } from '../mina-explorer'
import { createChainHistoryProvider as ob } from '../obscura-provider'
import { ProviderConfig } from './types'

export const createChainHistoryProvider = (
  config: ProviderConfig
): ChainHistoryProvider => {
  const underlyingProvider =
    config.providerName === 'mina-explorer'
      ? me(config.archiveUrl || config.url)
      : ob(config.archiveUrl || config.url)

  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Mina.TransactionBody[]> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return (await underlyingProvider.transactionsByAddresses(
      args
    )) as Mina.TransactionBody[]
  }

  const transactionsByHashes = async (
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> => {
    // Delegate the call to the underlying provider's getAccountInfo method
    return (await underlyingProvider.transactionsByHashes(
      args
    )) as Mina.TransactionBody[]
  }

  const healthCheck = async (): Promise<HealthCheckResponse> => {
    // Delegate the call to the underlying provider's healthCheck method
    return underlyingProvider.healthCheck()
  }

  return {
    transactionsByAddresses,
    transactionsByHashes,
    healthCheck
  }
}
