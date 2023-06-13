import { MinaNetwork } from '@palladxyz/mina'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { VaultState } from '../lib/const'
import { localPersistence } from '../lib/storage'

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

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      menuOpen: false,
      network: MinaNetwork[MinaNetwork.MAINNET],
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
