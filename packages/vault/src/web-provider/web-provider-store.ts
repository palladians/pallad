import { produce } from "immer"
import { type StateCreator, create } from "zustand"

import type {
  //AuthorizationState,
  WebProviderState,
  WebProviderStore,
} from "./web-provider-state"

const initialState: WebProviderState = {
  authorized: {
    //'https://palladians.github.io': AuthorizationState.ALLOWED
  },
}

export const webProviderSlice: StateCreator<WebProviderStore> = (set) => ({
  ...initialState,
  mutateZkAppPermission: ({ origin, authorizationState }) => {
    return set(
      produce((state) => {
        state.authorized[origin] = authorizationState
      }),
    )
  },
  removeZkAppPermission: ({ origin }) => {
    return set(
      produce((state) => {
        delete state.authorized[origin]
      }),
    )
  },
  reset: () => set({ ...initialState }),
})

export const useWebProviderVault = create<WebProviderStore>(webProviderSlice)
