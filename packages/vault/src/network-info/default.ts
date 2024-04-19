import { ProviderConfig } from '@palladxyz/providers'

import { NetworkName } from './network-info-state'

export const DEFAULT_NETWORK = 'Berkeley' //'Berkeley'
/*
Note: it is good practice to match the key with the networkName.
*/
export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  Berkeley: {
    nodeEndpoint: {
      providerName: 'obscura',
      url: 'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-node',
      url: 'https://berkeley.graphql.minaexplorer.com'
    },
    networkName: 'Berkeley',
    chainId: '...' // todo: fetch chainId from a provider
  },
  /*Mainnet: {
    nodeEndpoint: {
      providerName: 'mina-node',
      url: 'https://proxy.minaexplorer.com/graphql'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-node',
      url: 'https://graphql.minaexplorer.com'
    },
    networkName: 'Berkeley',
    chainId: '...' // todo: fetch chainId from a provider
  },*/
  ZekoDevNet: {
    nodeEndpoint: {
      providerName: 'mina-node',
      url: 'http://sequencer-zeko-dev.dcspark.io/graphql'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-node',
      url: ''
    },
    networkName: 'ZekoDevNet',
    chainId: '...' // todo: fetch chainId from a provider
  },
  OptimismSepolia: {
    nodeEndpoint: {
      providerName: 'evm-rpc',
      url: 'wss://optimism-sepolia-rpc.publicnode.com'
    },
    archiveNodeEndpoint: {
      providerName: 'evm-explorer',
      url: 'https://api-sepolia-optimism.etherscan.io/'
    },
    networkName: 'OptimismSepolia',
    chainId: '...' // todo: fetch chainId from a provider
  }
}
