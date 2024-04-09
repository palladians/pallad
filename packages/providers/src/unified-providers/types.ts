export type ProviderConfig = {
  nodeEndpoint: {
    providerName: 'mina-node' | 'obscura'
    url: string
  }
  archiveNodeEndpoint: {
    providerName: 'mina-node' | 'obscura'
    url: string
  }
  networkName: string
  chainId: string
}
