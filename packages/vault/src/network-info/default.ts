import type { ProviderConfig } from "@palladxyz/providers"

import type { NetworkName } from "./network-info-state"

export const DEFAULT_NETWORK = process.env.VITE_APP_DEFAULT_NETWORK ?? "Mainnet"
/*
Note: it is good practice to match the key with the networkName.
*/
export const DEFAULT_NETWORK_INFO: Record<NetworkName, ProviderConfig> = {
  Devnet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url:
        process.env.VITE_APP_MINA_PROXY_DEVNET_URL ??
        "https://api.minascan.io/node/devnet/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://minascan.io/devnet/api/",
    },
    explorer: {
      transactionUrl: "https://minascan.io/devnet/tx/{hash}/txInfo",
      accountUrl: "https://minascan.io/devnet/account/{publicKey}",
    },
    networkName: "Devnet",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
  Mainnet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url:
        process.env.VITE_APP_MINA_PROXY_MAINNET_URL ??
        "https://api.minascan.io/node/mainnet/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://minascan.io/mainnet/api/",
    },
    explorer: {
      transactionUrl: "https://minascan.io/mainnet/tx/{hash}/txInfo",
      accountUrl: "https://minascan.io/mainnet/account/{publicKey}",
    },
    networkName: "Mainnet",
    networkType: "mainnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
  ZekoDevNet: {
    nodeEndpoint: {
      providerName: "mina-node",
      url: "https://devnet.zeko.io/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "zeko-scan",
      url: "https://zekoscan.io/devnet",
    },
    explorer: {
      transactionUrl: "https://zekoscan.io/devnet/tx/{hash}/txInfo",
      accountUrl: "https://zekoscan.io/devnet/account/{publicKey}",
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
    explorer: {
      transactionUrl: "",
      accountUrl: "",
    },
    networkName: "OptimismSepolia",
    networkType: "testnet",
    chainId: "...", // todo: fetch chainId from a provider
  },
}
