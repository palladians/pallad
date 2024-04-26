import { getLocalPersistence } from "@palladxyz/persistence"
import { DEFAULT_NETWORK } from "@palladxyz/vault"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { VaultState } from "../lib/const"

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  network: string
  vaultState: VaultState
  shareData: boolean
}

type AppQueries = {
  isInitialized: () => boolean
}

type AppMutators = {
  setNetwork: (network: string) => void
  setVaultState: (vaultState: VaultState) => void
  setVaultStateInitialized: () => void
  setVaultStateUninitialized: () => void
  setShareData: (shareData: boolean) => void
}

type AppStore = AppState & AppMutators & AppQueries

// TODO: this should be with vite
// const VITE_APP_DEFAULT_NETWORK = import.meta.env.VITE_APP_DEFAULT_NETWORK || 'Mainnet'
const defaultNetwork = DEFAULT_NETWORK

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      network: defaultNetwork,
      vaultState: VaultState[VaultState.UNINITIALIZED],
      shareData: true,
      isInitialized: () => {
        const { vaultState } = get()
        return vaultState === VaultState[VaultState.INITIALIZED]
      },
      setNetwork(network) {
        return set({
          network: network,
        })
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
    }),
    {
      name: "PalladApp",
      storage: createJSONStorage(getLocalPersistence),
    },
  ),
)
