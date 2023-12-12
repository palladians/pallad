import { Multichain } from '@palladxyz/multi-chain-core'

export type NetworkName = string
export type StoredProvider = Multichain.MultiChainProvider | undefined

export type SingleProviderState = {
  networkName: NetworkName
  provider: StoredProvider
}

export const initialProviderState: SingleProviderState = {
  networkName: '',
  provider: undefined
}

export type ProviderStore = {
  providers: Record<NetworkName, SingleProviderState>
  currentNetwork: NetworkName
  setCurrentNetwork: (networkName: NetworkName) => void
  getCurrentNetwork: () => NetworkName
  ensureProvider: (
    providerName: NetworkName,
    config: Multichain.MultichainProviderConfig,
    network: Multichain.MultiChainNetworks
  ) => void
  setProvider: (providerState: SingleProviderState) => void
  getProvider: (
    providerName: NetworkName
  ) => SingleProviderState | typeof initialProviderState
  removeProvider: (name: NetworkName) => void
  getAvailableNetworks: () => NetworkName[]
  clear: () => void
}
