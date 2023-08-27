import { ChainAddress } from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createStore, StoreApi } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  AccountState,
  initialSingleAccountState,
  SingleAccountState
} from './accountState'

export class AccountStore {
  private store: StoreApi<AccountState>

  constructor() {
    const persistedStore = persist<AccountState>(
      (set, get) => ({
        state: {
          mainnet: {},
          devnet: {},
          berkeley: {}
        },

        ensureAccount: (network: Mina.Networks, address: ChainAddress): void => {
          set((current) => {
            if (!current.state[network]) {
              return {
                ...current,
                state: { ...current.state, [network]: {} }
              }
            }
            if (!current.state[network][address]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  [network]: {
                    ...current.state[network],
                    [address]: { ...initialSingleAccountState }
                  }
                }
              }
            }
            return current // if no changes, return the current state
          })
        },

        setAccountInfo: (
          network: Mina.Networks,
          address: ChainAddress,
          accountInfo: AccountInfo
        ): void => {
          set((current) => ({
            ...current,
            state: {
              ...current.state,
              [network]: {
                ...current.state[network],
                [address]: {
                  ...current.state[network][address],
                  accountInfo: accountInfo
                }
              }
            }
          }))
        },

        setTransactions: (
          network: Mina.Networks,
          address: ChainAddress,
          transactions: Mina.TransactionBody[]
        ): void => {
          set((current) => ({
            ...current,
            state: {
              ...current.state,
              [network]: {
                ...current.state[network],
                [address]: {
                  ...current.state[network][address],
                  transactions: transactions
                }
              }
            }
          }))
        },

        getAccountInfo: (network: Mina.Networks, address: ChainAddress): SingleAccountState => {
          return get().state[network]?.[address] || initialSingleAccountState
        },

        getTransactions: (network: Mina.Networks, address: ChainAddress): Mina.TransactionBody[] => {
          return get().state[network]?.[address]?.transactions || []
        },

        addAccount: (network: Mina.Networks, address: ChainAddress): void => {
          // This logic is the same as ensureAccount, consider reusing.
          set((current) => {
            if (!current.state[network]) {
              return {
                ...current,
                state: { ...current.state, [network]: {} }
              }
            }
            if (!current.state[network][address]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  [network]: {
                    ...current.state[network],
                    [address]: { ...initialSingleAccountState }
                  }
                }
              }
            }
            return current // if no changes, return the current state
          })
        },

        removeAccount: (network: Mina.Networks, address: ChainAddress): void => {
          set((current) => {
            const newState = { ...current.state[network] }
            delete newState[address]
            return {
              ...current,
              state: {
                ...current.state,
                [network]: newState
              }
            }
          })
        }
      }),
      {
        name: 'PalladAccount',
        storage: createJSONStorage(getSecurePersistence)
      }
    )

    this.store = createStore<AccountState>(persistedStore as any)
  }

  ensureAccount(network: Mina.Networks, address: ChainAddress): void {
    this.store.getState().ensureAccount(network, address)
  }

  setAccountInfo(
    network: Mina.Networks,
    address: ChainAddress,
    accountInfo: AccountInfo
  ): void {
    this.store.getState().setAccountInfo(network, address, accountInfo)
  }

  setTransactions(
    network: Mina.Networks,
    address: ChainAddress,
    transactions: Mina.TransactionBody[]
  ): void {
    this.store.getState().setTransactions(network, address, transactions)
  }

  getAccountInfo(
    network: Mina.Networks,
    address: ChainAddress
  ): SingleAccountState {
    return this.store.getState().getAccountInfo(network, address)
  }

  getTransactions(
    network: Mina.Networks,
    address: ChainAddress
  ): Mina.TransactionBody[] {
    return this.store.getState().getTransactions(network, address)
  }

  addAccount(network: Mina.Networks, address: ChainAddress): void {
    this.store.getState().addAccount(network, address)
  }

  removeAccount(network: Mina.Networks, address: ChainAddress): void {
    this.store.getState().removeAccount(network, address)
  }

  /**
   * TODO:
   * - Account Sync
   * - Check for pending transactions & mutate if no longer pending
   */
}

export default AccountStore
