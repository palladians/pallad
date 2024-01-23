export type ProviderConfig = {
  nodeEndpoint: {
    providerName: 'mina-explorer' | 'obscura'
    url: string
  }
  archiveNodeEndpoint?: {
    providerName: 'mina-explorer' | 'obscura'
    url: string
  }
  networkName: string
  chainId: string
}
