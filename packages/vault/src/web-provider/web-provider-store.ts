import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { WebProviderStore } from './web-provider-state'

export const webProviderSlice: StateCreator<WebProviderStore> = (set, get) => ({
  enabled: false,
  setEnabled: (enabled) => {
    set(
      produce((state) => {
        state.enabled = enabled
      })
    )
  },
  getEnabled: () => {
    const { enabled } = get()
    return enabled
  },
  clear: () => {
    set(
      produce((state) => {
        state.tokenInfo = {}
      })
    )
  }
})
