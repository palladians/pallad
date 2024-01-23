import { ProviderConfig } from '@palladxyz/providers'

import { NetworkName } from './network-info-state'

export const DEFAULT_NETWORK = 'Mina - Berkeley'

export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  'Mina - Berkeley': {
    nodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://proxy.berkeley.minaexplorer.com/'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://berkeley.graphql.minaexplorer.com'
    },
    networkName: 'Mina - Berkeley',
    chainId: '...' // todo: fetch chainId from a provider
  }
}
