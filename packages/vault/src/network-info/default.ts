import type { ProviderConfig } from "@palladxyz/providers"

import type { NetworkId } from "./network-info-state"

export const DEFAULT_NETWORK =
  process.env.VITE_APP_DEFAULT_NETWORK_ID ?? "mina:mainnet"

export const DEFAULT_NETWORK_INFO: Record<NetworkId, ProviderConfig> = {
  "mina:devnet": {
    nodeEndpoint: {
      providerName: "mina-node",
      url:
        process.env.VITE_APP_MINA_PROXY_DEVNET_URL ??
        "https://api.minascan.io/node/devnet/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://pallad.co/api/proxy/mina-devnet",
    },
    explorer: {
      transactionUrl: "https://minascan.io/devnet/tx/{hash}/txInfo",
      accountUrl: "https://minascan.io/devnet/account/{publicKey}",
      pendingTransactionsUrl:
        "https://minascan.io/devnet/txs/pending-txs?search={publicKey}",
    },
    networkName: "Devnet",
    networkType: "testnet",
    networkId: "mina:devnet",
  },
  "mina:mainnet": {
    nodeEndpoint: {
      providerName: "mina-node",
      url:
        process.env.VITE_APP_MINA_PROXY_MAINNET_URL ??
        "https://api.minascan.io/node/mainnet/v1/graphql",
    },
    archiveNodeEndpoint: {
      providerName: "mina-scan",
      url: "https://pallad.co/api/proxy/mina-mainnet",
    },
    explorer: {
      transactionUrl: "https://minascan.io/mainnet/tx/{hash}/txInfo",
      accountUrl: "https://minascan.io/mainnet/account/{publicKey}",
      pendingTransactionsUrl:
        "https://minascan.io/mainnet/txs/pending-txs?search={publicKey}",
    },
    networkName: "Mainnet",
    networkType: "mainnet",
    networkId: "mina:mainnet",
  },
}
