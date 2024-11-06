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
  setAccountInfo: (network, address, accountInfo) => {
    const { accounts } = get()
    const account = accounts[network]?.[address] ?? {}
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...account,
          accountInfo,
        }
      }),
    )
  },
  setTransactions: (network, address, transactions) => {
    const { accounts } = get()
    const account = accounts[network]?.[address] ?? {}
    set(
      produce((state) => {
        state.accounts[network][address] = {
          ...account,
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
  getAccountsInfo: (networkId, address) => {
    const { accounts } = get()
    return accounts[networkId]?.[address] || initialSingleAccountState
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
