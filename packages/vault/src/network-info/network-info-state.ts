/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} NetworkInfoStore
 */

import type { ProviderConfig } from "@palladco/providers"

export type NetworkId = string

export type NetworkInfoState = {
  networkInfoV3: Record<NetworkId, ProviderConfig>
  currentNetworkId: string
}

export type NetworkInfoActions = {
  setCurrentNetworkId: (networkId: NetworkId) => void
  getCurrentNetworkInfo: () => ProviderConfig | undefined
  setNetworkInfo: (networkId: NetworkId, providerConfig: ProviderConfig) => void
  getNetworkInfo: (networkId: NetworkId) => ProviderConfig | undefined
  removeNetworkInfo: (ticker: string) => void
  allNetworkInfo: () => (ProviderConfig | undefined)[]
  clearNetworkInfo: () => void
}

export type NetworkInfoStore = NetworkInfoState & NetworkInfoActions
