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
  ensureAccount: (network, address) => {
    set(
      produce((state) => {
        if (!state.accounts[network]?.[address]) {
          if (!state.accounts[network]) {
            state.accounts[network] = {}
          }
          state.accounts[network][address] = {
            ...initialSingleAccountState,
            ...state.accounts[network][address],
          }
        }
      }),
    )
  },
  setAccountInfo: (network, address, accountInfo) => {
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...state.accounts[network][address],
          accountInfo,
        }
      }),
    )
  },
  setTransactions: (network, address, transactions) => {
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...state.accounts[network][address],
          transactions,
        }
      }),
    )
  },
  addAccount: (network, address) => {
    set(
      produce((state) => {
        if (!state.accounts?.[network]?.[address]) {
          state.accounts[network] = state.accounts[network] || {}
          state.accounts[network][address] = {
            ...initialSingleAccountState,
          }
        }
      }),
    )
  },
  removeAccount: (network, address) => {
    set(
      produce((state) => {
        delete state.accounts[network][address]
      }),
    )
  },
  getAccountsInfo: (network, address) => {
    const { accounts } = get()
    return accounts[network]?.[address] || initialSingleAccountState
  },
  getAccountInfo: (network, address, ticker) => {
    const { accounts } = get()
    return (
      accounts[network]?.[address]?.accountInfo[ticker] || {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: "",
        publicKey: "",
      }
    )
  },
  getTransactions: (network, address, ticker) => {
    const { accounts } = get()
    return accounts[network]?.[address]?.transactions[ticker] || []
  },
  getTransaction: (network, address, hash, ticker) => {
    const { accounts } = get()
    const transactions =
      accounts[network]?.[address]?.transactions[ticker] || []
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
