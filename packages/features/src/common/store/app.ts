import { localPersistence } from "@palladco/vault"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { VaultState } from "../lib/const"

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  vaultState: VaultState
  shareData: boolean
  useFiatBalance: boolean
}

type AppQueries = {
  isInitialized: () => boolean
}

type AppMutators = {
  setVaultState: (vaultState: VaultState) => void
  setVaultStateInitialized: () => void
  setVaultStateUninitialized: () => void
  setShareData: (shareData: boolean) => void
  setUseFiatBalance: (useFiatBalance: boolean) => void
}

type AppStore = AppState & AppMutators & AppQueries

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      useFiatBalance: true,
      vaultState: VaultState[VaultState.UNINITIALIZED],
      shareData: true,
      isInitialized: () => {
        const { vaultState } = get()
        return vaultState === VaultState[VaultState.INITIALIZED]
      },
      setShareData(shareData) {
        return set({ shareData })
      },
      setVaultState(vaultState) {
        return set({ vaultState })
      },
      setVaultStateInitialized: async () => {
        const { setVaultState } = get()
        const { id } = chrome.runtime
        const { permissions } = await chrome.storage.local.get("permissions")
        await chrome.storage.local.set({
          permissions: {
            ...permissions,
            [`chrome-extension://${id}`]: "ALLOWED",
          },
        })
        return setVaultState(VaultState.INITIALIZED)
      },
      setVaultStateUninitialized: () => {
        const { setVaultState } = get()
        return setVaultState(VaultState.UNINITIALIZED)
      },
      setUseFiatBalance(useFiatBalance) {
        return set({ useFiatBalance })
      },
    }),
    {
      // Do not change this, may break Web Connector if not updated in Mina Provider.
      name: "PalladApp",
      storage: createJSONStorage(() => localPersistence),
    },
  ),
)
