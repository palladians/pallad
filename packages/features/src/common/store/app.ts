import { MinaNetwork } from '@palladxyz/key-generator'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { VaultState } from '../lib/const'
import { localPersistence } from '../lib/storage'

// TODO: Make network generic
type AppState = {
  menuOpen: boolean
  network: MinaNetwork
  vaultState: VaultState
}

type AppMutators = {
  setMenuOpen: (menuOpen: boolean) => void
  setNetwork: (network: MinaNetwork) => void
  setVaultState: (vaultState: VaultState) => void
}

type AppStore = AppState & AppMutators

export const appStore = createStore<AppStore>()(
  persist(
    (set) => ({
      menuOpen: false,
      network: MinaNetwork[MinaNetwork.Mainnet],
      vaultState: VaultState[VaultState.UNINITIALIZED],
      setMenuOpen(menuOpen) {
        return set({ menuOpen })
      },
      setNetwork(network) {
        return set({ network: MinaNetwork[network] })
      },
      setVaultState(vaultState) {
        return set({ vaultState })
      }
    }),
    {
      name: 'PalladApp',
      storage: createJSONStorage(() => localPersistence),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['menuOpen'].includes(key))
        )
    }
  )
)

export const useAppStore = (selector: any) => useStore(appStore, selector)
