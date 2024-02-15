/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} NetworkInfoStore
 */

import { ProviderConfig } from '@palladxyz/providers'

/* Network info store should
- store information related to a specific network that allows a provider to connect to it
     - this could include signing args like mina-signer's "testnet" or "mainnet" -- TODO: consider creating a new type that extends ProviderConfig
*/

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
  updateChainId: (networkName: NetworkName) => void
  getNetworkInfo: (networkName: NetworkName) => ProviderConfig | undefined
  removeNetworkInfo: (ticker: string) => void
  allNetworkInfo: () => (ProviderConfig | undefined)[]
  getChainIds: () => string[]
  clear: () => void
}

export type NetworkInfoStore = NetworkInfoState & NetworkInfoActions
