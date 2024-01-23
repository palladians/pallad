import { createMinaProvider, ProviderConfig } from '@palladxyz/providers'
import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { DEFAULT_NETWORK, DEFAULT_NETWORK_INFO } from './default'
import { NetworkInfoStore } from './network-info-state'

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfo: DEFAULT_NETWORK_INFO,
  currentNetworkInfo: DEFAULT_NETWORK_INFO[DEFAULT_NETWORK] as ProviderConfig,
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
  updateChainId: async (networkName) => {
    const { networkInfo } = get()
    const providerConfig = networkInfo[networkName]
    if (!providerConfig) {
      throw new Error(
        `Could not find providerConfig for ${networkName} in updateChainId`
      )
    }
    const provider = createMinaProvider(providerConfig)
    if (!provider.getDaemonStatus) {
      throw new Error(
        `Could not getDaemonStatus for ${networkName} in updateChainId`
      )
    }
    const response = await provider.getDaemonStatus()!
    if (!response.daemonStatus.chainId) {
      throw new Error(
        `Could not get chainId for ${networkName} in updateChainId`
      )
    }
    set(
      produce((state) => {
        state.networkInfo[networkName].chainId = response.daemonStatus.chainId
      })
    )
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
  getChainIds: () => {
    const { networkInfo } = get()
    if (!networkInfo) {
      return []
    }

    return Object.keys(networkInfo).flatMap((networkName) => {
      const network = networkInfo[networkName]
      return network && typeof network.chainId !== 'undefined'
        ? [network.chainId]
        : []
    })
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
