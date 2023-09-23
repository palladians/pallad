import { Mina } from '@palladxyz/mina-core'
import { getLocalPersistence } from '@palladxyz/persistence'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { VaultState } from '../lib/const'

const VITE_APP_DEFAULT_NETWORK =
  import.meta.env.VITE_APP_DEFAULT_NETWORK || 'Mainnet'

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  network: Mina.Networks
  vaultState: VaultState
}

type AppQueries = {
  isInitialized: () => boolean
}

type AppMutators = {
  setNetwork: (network: Mina.Networks) => void
  setVaultState: (vaultState: VaultState) => void
  setVaultStateInitialized: () => void
}

type AppStore = AppState & AppMutators & AppQueries

// TODO: unify network types in @core and @key-management
const defaultNetwork =
  Mina.Networks[
    VITE_APP_DEFAULT_NETWORK.toUpperCase() as keyof typeof Mina.Networks
  ]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      network: defaultNetwork,
      vaultState: VaultState[VaultState.UNINITIALIZED],
      isInitialized: () => {
        const { vaultState } = get()
        return vaultState === VaultState[VaultState.INITIALIZED]
      },
      setNetwork(network) {
        return set({
          network:
            Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        })
      },
      setVaultState(vaultState) {
        return set({ vaultState })
      },
      setVaultStateInitialized: () => {
        const { setVaultState } = get()
        return setVaultState(VaultState.INITIALIZED)
      }
    }),
    {
      name: 'PalladApp',
      storage: createJSONStorage(getLocalPersistence)
    }
  )
)
