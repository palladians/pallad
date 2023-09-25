import { ChainAddress } from '@palladxyz/key-management'
import { Multichain } from '@palladxyz/multi-chain-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { create, StoreApi } from 'zustand'
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
          accounts: {} as Record<
            Multichain.MultiChainNetworks,
            Record<ChainAddress, SingleAccountState>
          >
        },
        // Maybe this works?
        rehydrate: async () => {
          const state = await getSecurePersistence().getItem('PalladAccount')
          if (state) {
            set(JSON.parse(state))
          }
        },

        ensureAccount: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress
        ): void => {
          set((current) => {
            if (!current.state.accounts[network]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  accounts: { ...current.state.accounts, [network]: {} }
                }
              }
            }
            if (!current.state.accounts[network][address]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  accounts: {
                    ...current.state.accounts,
                    [network]: {
                      ...current.state.accounts[network],
                      [address]: { ...initialSingleAccountState }
                    }
                  }
                }
              }
            }
            return current // if no changes, return the current state
          })
        },

        setAccountInfo: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress,
          accountInfo: Multichain.MultiChainAccountInfo
        ): void => {
          set((current) => {
            const networkAccounts = current.state.accounts[network] || {}
            const accountData =
              networkAccounts[address] || initialSingleAccountState

            return {
              ...current,
              state: {
                ...current.state,
                accounts: {
                  ...current.state.accounts,
                  [network]: {
                    ...networkAccounts,
                    [address]: {
                      ...accountData,
                      accountInfo: accountInfo
                    }
                  }
                }
              }
            }
          })
        },

        setTransactions: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress,
          transactions: Multichain.MultiChainTransactionBody[]
        ): void => {
          set((current) => {
            const networkAccounts = current.state.accounts[network] || {}
            const accountData =
              networkAccounts[address] || initialSingleAccountState

            return {
              ...current,
              state: {
                ...current.state,
                accounts: {
                  ...current.state.accounts,
                  [network]: {
                    ...networkAccounts,
                    [address]: {
                      ...accountData,
                      transactions: transactions
                    }
                  }
                }
              }
            }
          })
        },

        addAccount: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress
        ): void => {
          set((current) => {
            if (!current.state.accounts[network]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  accounts: { ...current.state.accounts, [network]: {} }
                }
              }
            }
            if (!current.state.accounts[network][address]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  accounts: {
                    ...current.state.accounts,
                    [network]: {
                      ...current.state.accounts[network],
                      [address]: { ...initialSingleAccountState }
                    }
                  }
                }
              }
            }
            return current // if no changes, return the current state
          })
        },

        removeAccount: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress
        ): void => {
          set((current) => {
            const newState = { ...current.state.accounts[network] }
            delete newState[address]
            return {
              ...current,
              state: {
                ...current.state,
                accounts: {
                  ...current.state.accounts,
                  [network]: newState
                }
              }
            }
          })
        },

        getAccountInfo: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress
        ): SingleAccountState => {
          return (
            get().state.accounts[network]?.[address] ||
            initialSingleAccountState
          )
        },

        getTransactions: (
          network: Multichain.MultiChainNetworks,
          address: ChainAddress
        ): Multichain.MultiChainTransactionBody[] => {
          return get().state.accounts[network]?.[address]?.transactions || []
        }
      }),
      {
        name: 'PalladAccount',
        storage: createJSONStorage(getSecurePersistence),
        skipHydration: true
      }
    )

    this.store = create<AccountState>(persistedStore as any)
  }

  ensureAccount(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ): void {
    this.store.getState().ensureAccount(network, address)
  }

  setAccountInfo(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    accountInfo: Multichain.MultiChainAccountInfo
  ): void {
    this.store.getState().setAccountInfo(network, address, accountInfo)
  }

  setTransactions(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    transactions: Multichain.MultiChainTransactionBody[]
  ): void {
    this.store.getState().setTransactions(network, address, transactions)
  }

  getAccountInfo(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ): SingleAccountState {
    return this.store.getState().getAccountInfo(network, address)
  }

  getTransactions(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ): Multichain.MultiChainTransactionBody[] {
    return this.store.getState().getTransactions(network, address)
  }

  addAccount(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ): void {
    this.store.getState().addAccount(network, address)
  }

  removeAccount(
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ): void {
    this.store.getState().removeAccount(network, address)
  }

  rehydrate = async (): Promise<void> => {
    await this.store.getState().rehydrate()
  }

  /**
   * TODO:
   * - Account Sync
   * - Check for pending transactions & mutate if no longer pending
   * - - Could do this with events and a subscription
   */
}

export default AccountStore
