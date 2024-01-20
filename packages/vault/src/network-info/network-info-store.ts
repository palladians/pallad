import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { NetworkInfoStore } from './network-info-state'
/* 
export type NetworkName = string
export type NetworkInfoStore = {
  networkInfo: Record<NetworkName, ProviderConfig>
  setCurrentNetwork: (networkName: NetworkName) => void
  setNetworkInfo: (networkName: NetworkName, providerConfig: ProviderConfig) => void
  getNetworkInfo: (networkName: NetworkName) => ProviderConfig | undefined
  removeNetworkInfo: (ticker: string) => void
  allNetworkInfo: () => ProviderConfig[]
  clear: () => void
}
*/

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfo: {},
  currentNetworkInfo: undefined,
  setCurrentNetworkInfo: (networkName) => {
    const { networkInfo } = get()
    set(
      produce((state) => {
        state.currentNetwork = networkInfo[networkName]
      })
    )
  },
  getCurrentNetworkInfo: () => {
    const { currentNetworkInfo } = get()
    return currentNetworkInfo
  },
  setNetworkInfo: (networkName, providerConfig) => {
    set(
      produce((state) => {
        state.networkInfo[networkName] = providerConfig
      })
    )
  },
  getNetworkInfo: (networkName) => {
    const { networkInfo } = get()
    return networkInfo[networkName] || undefined
  },
  removeNetworkInfo: (networkName) => {
    set(
      produce((state) => {
        delete state.networkInfo[networkName]
      })
    )
  },
  allNetworkInfo: () => {
    const { networkInfo } = get()
    return Object.keys(networkInfo).map(
      (networkName) => networkInfo[networkName]
    )
  },
  clear: () => {
    set(
      produce((state) => {
        state.tokenInfo = {}
      })
    )
  }
})
