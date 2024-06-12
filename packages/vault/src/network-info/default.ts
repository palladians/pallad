import type { ProviderConfig } from "@palladxyz/providers"

import type { NetworkName } from "./network-info-state"

export const DEFAULT_NETWORK = "Devnet"
/*
Note: it is good practice to match the key with the networkName.
*/
export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  Devnet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url: "https://api.minascan.io/node/devnet/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://minascan.io/devnet/api/",
    },
    networkName: "Devnet",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
  /*Mainnet: {
    nodeEndpoint: {
      providerName: 'mina-node',
      url: 'https://api.minascan.io/node/mainnet/v1/graphql'
    },
    archiveNodeEndpoint: {
      providerName: 'mina-node',
      url: 'https://api.minascan.io/archive/mainnet/v1/graphql'
    },
    networkName: 'Mainnet',
    networkType: 'mainnet',
    chainId: '...' // todo: fetch chainId from a provider
  },*/
  ZekoDevNet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url: "https://devnet.zeko.io/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "zeko-scan",
      url: "https://zekoscan.io/devnet",
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
