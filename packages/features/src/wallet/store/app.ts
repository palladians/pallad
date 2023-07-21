import { MinaNetwork } from '@palladxyz/key-generator'
import { getLocalPersistence } from '@palladxyz/persistence'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { VaultState } from '../lib/const'

const VITE_APP_DEFAULT_NETWORK =
  import.meta.env.VITE_APP_DEFAULT_NETWORK || 'Mainnet'

// TODO: Make network a generic type that can support networks other than just Mina
type AppState = {
  network: MinaNetwork
  vaultState: VaultState
}

type AppQueries = {
  isInitialized: () => boolean
}

type AppMutators = {
  setNetwork: (network: MinaNetwork) => void
  setVaultState: (vaultState: VaultState) => void
  setVaultStateInitialized: () => void
}

type AppStore = AppState & AppMutators & AppQueries

const defaultNetwork =
  MinaNetwork[VITE_APP_DEFAULT_NETWORK as keyof typeof MinaNetwork]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      network: defaultNetwork,
      vaultState: VaultState[VaultState.UNINITIALIZED],
      isInitialized: () => {
        const { vaultState } = get()
        return vaultState === VaultState[VaultState.UNINITIALIZED]
      },
      setNetwork(network) {
        return set({ network: MinaNetwork[network] })
      },
      setVaultState(vaultState) {
        return set({ vaultState })
      },
      setVaultStateInitialized: () => {
        const { setVaultState } = get()
        return setVaultState(VaultState.UNINITIALIZED)
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
