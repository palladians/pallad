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
      pendingTransactionsUrl:
        "https://minascan.io/devnet/txs/pending-txs?search={publicKey}",
    },
    networkName: "Devnet",
    networkType: "testnet",
    chainId: "",
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
      pendingTransactionsUrl:
        "https://minascan.io/mainnet/txs/pending-txs?search={publicKey}",
    },
    networkName: "Mainnet",
    networkType: "mainnet",
    chainId: "",
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
      pendingTransactionsUrl:
        "https://zekoscan.io/devnet/txs/user-txs?search={publicKey}",
    },
    networkName: "ZekoDevNet",
    networkType: "testnet",
    chainId: "",
  },
}
