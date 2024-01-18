export type ProviderConfig = {
  providerName: 'mina-explorer' | 'obscura'
  networkName: string
  url: string
  archiveUrl?: string
  chainId: string
}
