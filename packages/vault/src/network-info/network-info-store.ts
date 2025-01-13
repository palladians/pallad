import { produce } from "immer"
import type { StateCreator } from "zustand"

import { DEFAULT_NETWORK_INFO } from "./default"
import type { NetworkInfoStore } from "./network-info-state"

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfoV3: DEFAULT_NETWORK_INFO,
  currentNetworkId: process.env.VITE_APP_DEFAULT_NETWORK_ID ?? "mina:mainnet",
  setCurrentNetworkId: (networkId) => {
    return set({ currentNetworkId: networkId })
  },
  getCurrentNetworkInfo: () => {
    const { networkInfoV3, currentNetworkId } = get()
    return Object.values(networkInfoV3).find(
      (network) => network.networkId === currentNetworkId,
    )
  },
  setNetworkInfo: (networkId, providerConfig) => {
    const { networkInfoV3 } = get()
    set((current) =>
      produce(current, (draft) => {
        draft.networkInfoV3[networkId] = {
          ...networkInfoV3[networkId],
          ...providerConfig,
        }
      }),
    )
  },
  getNetworkInfo: (networkId) => {
    const { networkInfoV3 } = get()
    return networkInfoV3[networkId] || undefined
  },
  removeNetworkInfo: (networkId) => {
    set((current) =>
      produce(current, (draft) => {
        delete draft.networkInfoV3[networkId]
      }),
    )
  },
  allNetworkInfo: () => {
    const { networkInfoV3 } = get()
    return Object.keys(networkInfoV3).map(
      (networkId) => networkInfoV3[networkId],
    )
  },
  clearNetworkInfo: () => {
    set((current) =>
      produce(current, (draft) => {
        draft.networkInfoV3 = DEFAULT_NETWORK_INFO
      }),
    )
  },
})
