import { MinaNetwork } from '@palladxyz/mina'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { localPersistence } from '../lib/storage'

type AppState = {
  menuOpen: boolean
  network: MinaNetwork
}

type AppMutators = {
  setMenuOpen: (menuOpen: boolean) => void
  setNetwork: (network: MinaNetwork) => void
}

type AppStore = AppState & AppMutators

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      menuOpen: false,
      network: MinaNetwork[MinaNetwork.MAINNET],
      setMenuOpen(menuOpen) {
        return set({ menuOpen })
      },
      setNetwork(network) {
        return set({ network: MinaNetwork[network] })
      }
    }),
    {
      name: 'PalladApp',
      storage: createJSONStorage(() => localPersistence)
    }
  )
)
