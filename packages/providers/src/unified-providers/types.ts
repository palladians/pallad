export type ProviderConfig = {
  nodeEndpoint: {
    providerName: 'mina-node' | 'obscura' | 'evm-rpc'
    url: string
  }
  archiveNodeEndpoint: {
    providerName: 'mina-node' | 'obscura' | 'evm-explorer'
    url: string
  }
  networkName: string
  networkType: 'testnet' | 'mainnet'
  chainId: string
}
