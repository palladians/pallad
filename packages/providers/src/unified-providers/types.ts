export type ProviderConfig = {
  nodeEndpoint: {
    providerName: "mina-node"
    url: string
  }
  archiveNodeEndpoint: {
    providerName: "mina-scan" | "zeko-scan"
    url: string
  }
  explorer: {
    transactionUrl: string
    accountUrl: string
    pendingTransactionsUrl: string
  }
  networkName: string
  networkType: "testnet" | "mainnet"
  networkId: string
}
