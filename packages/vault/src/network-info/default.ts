import { ProviderConfig } from '@palladxyz/providers'

import { NetworkName } from './network-info-state'

export const DEFAULT_NETWORK = 'Berkeley'

export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  Berkeley: {
    nodeEndpoint: {
      providerName: 'obscura',
      url: 'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://berkeley.graphql.minaexplorer.com'
    },
    networkName: 'Berkeley',
    chainId: '...' // todo: fetch chainId from a provider
  }
}
