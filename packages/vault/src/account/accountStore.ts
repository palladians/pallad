import { Multichain } from '@palladxyz/multi-chain-core'
import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { AccountState, AccountStore, SingleAccountState } from './accountState'

export const initialAccountStoreState: AccountState = {
  accounts: {} as never
}

export const initialSingleAccountState: SingleAccountState = {
  accountInfo: {} as Multichain.MultiChainAccountInfo,
  transactions: []
}

export const accountSlice: StateCreator<AccountStore> = (set, get) => ({
  ...initialAccountStoreState,
  ensureAccount: (network, address) => {
    set(
      produce((state) => {
        if (!state.accounts[network]?.[address]) {
          state.accounts[network] = {}
          state.accounts[network][address] = {
            ...initialSingleAccountState,
            ...state.accounts[network][address]
          }
        }
      })
    )
  },
  setAccountInfo: (network, address, accountInfo) => {
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...state.accounts[network][address],
          accountInfo
        }
      })
    )
  },
  setTransactions: (network, address, transactions) => {
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...state.accounts[network][address],
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
})
