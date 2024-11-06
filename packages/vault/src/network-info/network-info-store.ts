import { produce } from "immer"
import type { StateCreator } from "zustand"

import { DEFAULT_NETWORK_INFO } from "./default"
import type { NetworkInfoStore } from "./network-info-state"

export const networkInfoSlice: StateCreator<NetworkInfoStore> = (set, get) => ({
  networkInfoV2: DEFAULT_NETWORK_INFO,
  currentNetworkId: "mina:mainnet",
  setCurrentNetworkId: (networkId) => {
    return set({ currentNetworkId: networkId })
  },
  getCurrentNetworkInfo: () => {
    const { networkInfoV2, currentNetworkId } = get()
    return Object.values(networkInfoV2).find(
      (network) => network.networkId === currentNetworkId,
    )
  },
  setNetworkInfo: (networkId, providerConfig) => {
    const { networkInfoV2 } = get()
    set((current) =>
      produce(current, (draft) => {
        draft.networkInfoV2[networkId] = {
          ...networkInfoV2[networkId],
          ...providerConfig,
        }
      }),
    )
  },
  getNetworkInfo: (networkId) => {
    const { networkInfoV2 } = get()
    return networkInfoV2[networkId] || undefined
  },
  removeNetworkInfo: (networkId) => {
    set((current) =>
      produce(current, (draft) => {
        delete draft.networkInfoV2[networkId]
      }),
    )
  },
  allNetworkInfo: () => {
    const { networkInfoV2 } = get()
    return Object.keys(networkInfoV2).map(
      (networkId) => networkInfoV2[networkId],
    )
  },
  clear: () => {
    set((current) =>
      produce(current, (draft) => {
        // TODO: fix this method it doesn't work
        draft.networkInfoV2 = {}
      }),
    )
  },
})
