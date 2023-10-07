import { Multichain } from '@palladxyz/multi-chain-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const initialAccountStoreState = {
  accounts: {} as Record<Multichain.MultiChainNetworks, ChainAddressMapping>
}

import {
  AccountState,
  ChainAddressMapping,
  initialSingleAccountState
} from './accountState'

export const useAccountStore = create<AccountState>()(
  persist(
    immer((set, get) => ({
      ...initialAccountStoreState,
      ensureAccount: (network, address) => {
        set((state) => {
          if (!state.accounts[network][address]) {
            state.accounts[network][address] = { ...initialSingleAccountState }
          }
        })
      },
      setAccountInfo: (network, address, accountInfo) => {
        set((state) => {
          const networkAccounts = state.accounts[network] || {}
          const accountData =
            networkAccounts[address] || initialSingleAccountState
          state.accounts[network] = state.accounts[network] || {}
          state.accounts[network][address] = {
            ...accountData,
            accountInfo
          }
        })
      },
      setTransactions: (network, address, transactions) => {
        set((state) => {
          const networkAccounts = state.accounts[network] || {}
          const accountData =
            networkAccounts[address] || initialSingleAccountState
          state.accounts[network] = state.accounts[network] || {}
          state.accounts[network][address] = {
            ...accountData,
            transactions
          }
        })
      },
      addAccount: (network, address) => {
        set((state) => {
          if (!state.accounts[network][address]) {
            state.accounts[network][address] = { ...initialSingleAccountState }
          }
        })
      },
      removeAccount: (network, address) => {
        set((state) => {
          delete state.accounts[network][address]
        })
      },
      getAccountInfo: (network, address) => {
        const { accounts } = get()
        return accounts[network]?.[address] || initialSingleAccountState
      },
      getTransactions: (network, address) => {
        const { accounts } = get()
        return accounts[network]?.[address]?.transactions || []
      }
    })),
    {
      name: 'PalladAccount',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)
