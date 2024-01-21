import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { DEFAULT_NETWORK, DEFAULT_NETWORK_INFO } from './default'
import { NetworkInfoStore } from './network-info-state'

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfo: DEFAULT_NETWORK_INFO,
  currentNetworkInfo: DEFAULT_NETWORK_INFO[DEFAULT_NETWORK],
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
