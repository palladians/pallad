/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} NetworkInfoStore
 */

import { ProviderConfig } from '@palladxyz/providers'

export type NetworkInfoState = {
  networkInfo: Record<NetworkName, ProviderConfig>
  currentNetworkName: NetworkName
}

export type NetworkName = string
export type NetworkInfoActions = {
  setCurrentNetworkName: (networkName: NetworkName) => void
  getCurrentNetworkInfo: () => ProviderConfig
  setNetworkInfo: (
    networkName: NetworkName,
    providerConfig: ProviderConfig
  ) => void
  getNetworkInfo: (networkName: NetworkName) => ProviderConfig | undefined
  removeNetworkInfo: (ticker: string) => void
  allNetworkInfo: () => (ProviderConfig | undefined)[]
  getChainIds: () => string[]
  updateNetworkInfo: (networkName: NetworkName, update: any) => void
  clear: () => void
}

export type NetworkInfoStore = NetworkInfoState & NetworkInfoActions
