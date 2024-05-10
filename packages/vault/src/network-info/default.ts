import type { ProviderConfig } from "@palladxyz/providers"

import type { NetworkName } from "./network-info-state"

export const DEFAULT_NETWORK = "Berkeley" //'Berkeley'
/*
Note: it is good practice to match the key with the networkName.
*/
export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  Berkeley: {
    nodeEndpoint: {
      providerName: "obscura",
      url: "https://api.minascan.io/node/berkeley/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://minascan.io/qanet/api/",
    },
    networkName: "Berkeley",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
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
    networkName: 'Mainnet',
    networkType: 'mainnet',
    chainId: '...' // todo: fetch chainId from a provider
  },*/
  ZekoDevNet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url: "http://sequencer-zeko-dev.dcspark.io/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-node",
      url: "",
    },
    networkName: "ZekoDevNet",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
  OptimismSepolia: {
    nodeEndpoint: {
      providerName: "evm-rpc",
      url: "wss://optimism-sepolia-rpc.publicnode.com",
    },
    archiveNodeEndpoint: {
      providerName: "evm-explorer",
      url: "https://api-sepolia-optimism.etherscan.io/",
    },
    networkName: "OptimismSepolia",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
}
