import { produce } from "immer"
import type { StateCreator } from "zustand"

import type {
  AccountState,
  AccountStore,
  SingleAccountState,
} from "./accountState"

export const initialAccountStoreState: AccountState = {
  accounts: {} as never,
}

export const initialSingleAccountState: SingleAccountState = {
  accountInfo: {},
  transactions: {},
}

export const accountSlice: StateCreator<AccountStore> = (set, get) => ({
  ...initialAccountStoreState,
  ensureAccount: (networkId, address) => {
    set(
      produce((state) => {
        if (!state.accounts[networkId]?.[address]) {
          if (!state.accounts[networkId]) {
            state.accounts[networkId] = {}
          }
          state.accounts[networkId][address] = {
            ...initialSingleAccountState,
            ...state.accounts[networkId][address],
          }
        }
      }),
    )
  },
  setAccountInfo: (networkId, address, accountInfo) => {
    const { accounts } = get()
    const account = accounts[networkId]?.[address] ?? {}
    set(
      produce((state) => {
        state.accounts[networkId][address] = {
          ...account,
          accountInfo,
        }
      }),
    )
  },
  setTransactions: (networkId, address, transactions) => {
    const { accounts } = get()
    const account = accounts[networkId]?.[address] ?? {}
    set(
      produce((state) => {
        state.accounts[networkId][address] = {
          ...account,
          transactions,
        }
      }),
    )
  },
  addAccount: (networkId, address) => {
    set(
      produce((state) => {
        if (!state.accounts?.[networkId]?.[address]) {
          state.accounts[networkId] = state.accounts[networkId] || {}
          state.accounts[networkId][address] = {
            ...initialSingleAccountState,
          }
        }
      }),
    )
  },
  removeAccount: (networkId, address) => {
    set(
      produce((state) => {
        delete state.accounts[networkId][address]
      }),
    )
  },
  getAccountsInfo: (networkId, address) => {
    const { accounts } = get()
    return accounts[networkId]?.[address] || initialSingleAccountState
  },
  getAccountInfo: (networkId, address, ticker) => {
    const { accounts } = get()
    return (
      accounts[networkId]?.[address]?.accountInfo[ticker] || {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: "",
        publicKey: "",
      }
    )
  },
  getTransactions: (networkId, address, ticker) => {
    const { accounts } = get()
    return accounts[networkId]?.[address]?.transactions[ticker] || []
  },
  getTransaction: (networkId, address, hash, ticker) => {
    const { accounts } = get()
    const transactions =
      accounts[networkId]?.[address]?.transactions[ticker] || []
    return transactions.find((tx) => tx.hash === hash)
  },
  clear: () => {
    set(
      produce((state) => {
        state.accounts = {} as never
      }),
    )
  },
})
