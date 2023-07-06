import { MinaNetwork } from '@palladxyz/key-generator'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { VaultState } from '../lib/const'
import { getLocalPersistence } from '../lib/storage'

const VITE_APP_DEFAULT_NETWORK =
  import.meta.env.VITE_APP_DEFAULT_NETWORK || 'Mainnet'

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  network: MinaNetwork
  vaultState: VaultState
}

type AppMutators = {
  setNetwork: (network: MinaNetwork) => void
  setVaultState: (vaultState: VaultState) => void
}

type AppStore = AppState & AppMutators

const defaultNetwork =
  MinaNetwork[VITE_APP_DEFAULT_NETWORK as keyof typeof MinaNetwork]

export const appStore = createStore<AppStore>()(
  persist(
    (set) => ({
      network: defaultNetwork,
      vaultState: VaultState[VaultState.UNINITIALIZED],
      setNetwork(network) {
        return set({ network: MinaNetwork[network] })
      },
      setVaultState(vaultState) {
        return set({ vaultState })
      }
    }),
    {
      name: 'PalladApp',
      storage: createJSONStorage(getLocalPersistence),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['menuOpen'].includes(key))
        )
    }
  )
)

export const useAppStore = (selector: any) => useStore(appStore, selector)
