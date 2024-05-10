export type ProviderConfig = {
  nodeEndpoint: {
    providerName: "mina-node" | "obscura" | "evm-rpc"
    url: string
  }
  archiveNodeEndpoint: {
    // TODO: remove "mina-node"
    providerName: "mina-node" | "mina-scan" | "evm-explorer"
    url: string
  }
  networkName: string
  networkType: "testnet" | "mainnet"
  chainId: string
}
