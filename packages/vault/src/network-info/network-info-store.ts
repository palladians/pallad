import type { ProviderConfig } from "@palladxyz/providers"
import { produce } from "immer"
import type { StateCreator } from "zustand"

import { DEFAULT_NETWORK, DEFAULT_NETWORK_INFO } from "./default"
import type { NetworkInfoStore } from "./network-info-state"

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfo: DEFAULT_NETWORK_INFO,
  currentNetworkName: DEFAULT_NETWORK,
  setCurrentNetworkName: (networkName) => {
    set((current) =>
      produce(current, (draft) => {
        draft.currentNetworkName = networkName
      }),
    )
  },
  getCurrentNetworkInfo: () => {
    const { networkInfo, currentNetworkName } = get()
    return networkInfo[currentNetworkName] as ProviderConfig
  },
  updateNetworkInfo: (networkName, updates) => {
    set((current) =>
      produce(current, (draft) => {
        // Ensure the network exists before trying to update it
        if (draft.networkInfo[networkName]) {
          draft.networkInfo[networkName] = {
            ...draft.networkInfo[networkName],
            ...updates,
          }
        }
      }),
    )
  },
  setNetworkInfo: (networkName, providerConfig) => {
    set((current) =>
      produce(current, (draft) => {
        draft.networkInfo[networkName] = providerConfig
      }),
    )
  },
  getNetworkInfo: (networkName) => {
    const { networkInfo } = get()
    return networkInfo[networkName] || undefined
  },
  removeNetworkInfo: (networkName) => {
    set((current) =>
      produce(current, (draft) => {
        delete draft.networkInfo[networkName]
      }),
    )
  },
  getChainIds: () => {
    const { networkInfo } = get()
    if (!networkInfo) {
      return []
    }

    return Object.keys(networkInfo).flatMap((networkName) => {
      const network = networkInfo[networkName]
      return network && typeof network.chainId !== "undefined"
        ? [network.chainId]
        : []
    })
  },
  allNetworkInfo: () => {
    const { networkInfo } = get()
    return Object.keys(networkInfo).map(
      (networkName) => networkInfo[networkName],
    )
  },
  clear: () => {
    set((current) =>
      produce(current, (draft) => {
        // TODO: fix this method it doesn't work
        draft.networkInfo = {}
      }),
    )
  },
})
