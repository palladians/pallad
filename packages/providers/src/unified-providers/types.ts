export type ProviderConfig = {
  nodeEndpoint: {
    providerName: "mina-node" | "evm-rpc"
    url: string
  }
  archiveNodeEndpoint: {
    // TODO: remove "mina-node"
    providerName: "mina-node" | "mina-scan" | "zeko-scan" | "evm-explorer"
    url: string
  }
  explorer: {
    transactionUrl: string
    accountUrl: string
    pendingTransactionsUrl: string
  }
  networkName: string
  networkType: "testnet" | "mainnet"
  chainId: string
}
