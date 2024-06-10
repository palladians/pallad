import { getLocalPersistence } from "@palladxyz/persistence"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { VaultState } from "../lib/const"

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  vaultState: VaultState
  shareData: boolean
  betaBannerVisible: boolean
}

type AppQueries = {
  isInitialized: () => boolean
}

type AppMutators = {
  setVaultState: (vaultState: VaultState) => void
  setVaultStateInitialized: () => void
  setVaultStateUninitialized: () => void
  setShareData: (shareData: boolean) => void
  setBetaBannerVisible: (betaBannerVisible: boolean) => void
}

type AppStore = AppState & AppMutators & AppQueries

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      betaBannerVisible: true,
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
      setVaultStateInitialized: () => {
        const { setVaultState } = get()
        return setVaultState(VaultState.INITIALIZED)
      },
      setVaultStateUninitialized: () => {
        const { setVaultState } = get()
        return setVaultState(VaultState.UNINITIALIZED)
      },
      setBetaBannerVisible(betaBannerVisible) {
        return set({ betaBannerVisible })
      },
    }),
    {
      name: "PalladApp",
      storage: createJSONStorage(getLocalPersistence),
    },
  ),
)
