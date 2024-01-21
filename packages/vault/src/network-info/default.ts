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
  },
  'Mina - Mainnet': {
    nodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://proxy.minaexplorer.com/'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://graphql.minaexplorer.com'
    },
    networkName: 'Mina - Mainnet',
    chainId: '...' // todo: fetch chainId from a provider
  },
  'Mina - Devnet': {
    nodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://proxy.devnet.minaexplorer.com/'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-explorer',
      url: 'https://devnet.graphql.minaexplorer.com'
    },
    networkName: 'Mina - Devnet',
    chainId: '...' // todo: fetch chainId from a provider
  }
}
