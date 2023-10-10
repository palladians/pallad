import { Multichain } from '@palladxyz/multi-chain-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { StoreInstance } from '../types'
import { AccountState, AccountStore, SingleAccountState } from './accountState'

export const initialAccountStoreState: AccountState = {
  accounts: {} as never
}

export const initialSingleAccountState: SingleAccountState = {
  accountInfo: {} as Multichain.MultiChainAccountInfo,
  transactions: []
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      ...initialAccountStoreState,
      ensureAccount: (network, address) => {
        set(
          produce((state) => {
            if (!state.accounts[network][address]) {
              state.accounts[network][address] = {
                ...initialSingleAccountState
              }
            }
          })
        )
      },
      setAccountInfo: (network, address, accountInfo) => {
        set(
          produce((state) => {
            const networkAccounts = state.accounts[network] || {}
            const accountData =
              networkAccounts[address] || initialSingleAccountState
            state.accounts[network] = state.accounts[network] || {}
            state.accounts[network][address] = {
              ...accountData,
              accountInfo
            }
          })
        )
      },
      setTransactions: (network, address, transactions) => {
        set(
          produce((state) => {
            const networkAccounts = state.accounts[network] || {}
            const accountData =
              networkAccounts[address] || initialSingleAccountState
            state.accounts[network] = state.accounts[network] || {}
            state.accounts[network][address] = {
              ...accountData,
              transactions
            }
          })
        )
      },
      addAccount: (network, address) => {
        set(
          produce((state) => {
            if (!state.accounts?.[network]?.[address]) {
              state.accounts[network] = state.accounts[network] || {}
              state.accounts[network][address] = {
                ...initialSingleAccountState
              }
            }
          })
        )
      },
      removeAccount: (network, address) => {
        set(
          produce((state) => {
            delete state.accounts[network][address]
          })
        )
      },
      getAccountInfo: (network, address) => {
        const { accounts } = get()
        return accounts[network]?.[address] || initialSingleAccountState
      },
      getTransactions: (network, address) => {
        const { accounts } = get()
        return accounts[network]?.[address]?.transactions || []
      },
      clear: () => {
        set(
          produce((state) => {
            state.accounts = {} as never
          })
        )
      }
    }),
    {
      name: 'PalladAccount',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)

export type AccountStoreInstance = StoreInstance<AccountStore>
