import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { WebProviderState, WebProviderStore } from './web-provider-state'

const initialState: WebProviderState = {
  authorized: {}
}

export const webProviderSlice: StateCreator<WebProviderStore> = (set) => ({
  ...initialState,
  mutateZkAppPermission: ({ origin, authorizationState }) => {
    return set(
      produce((state) => {
        state.authorized[origin] = authorizationState
      })
    )
  },
  removeZkAppPermission: ({ origin }) => {
    return set(
      produce((state) => {
        delete state.authorized[origin]
      })
    )
  },
  reset: () => set({ ...initialState })
})
