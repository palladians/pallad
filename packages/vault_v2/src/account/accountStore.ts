import {
    AccountStores,
    initialSingleAccountState,
    SingleAccountState,
  } from './accountState';
  import { ChainAddress } from '@palladxyz/key-management';
  import { AccountInfo, Mina } from '@palladxyz/mina-core';
  import { createStore } from 'zustand';
  import { createJSONStorage, persist } from 'zustand/middleware';
  import { getSecurePersistence } from '@palladxyz/persistence';
  
  export class AccountStore {
    private store: any;
  
    constructor() {
      this.store = createStore<AccountStores>(
        persist(
          (set, get) => ({
            state: {
              mainnet: {},
              devnet: {},
              berkeley: {},
            },
  
            ensureAccount: (network: Mina.Networks, address: ChainAddress) => {
                set((current) => {
                  if (!current.state[network]) {
                    return { ...current, state: { ...current.state, [network]: {} } };
                  }
                  if (!current.state[network][address]) {
                    return {
                      ...current,
                      state: {
                        ...current.state,
                        [network]: {
                          ...current.state[network],
                          [address]: { ...initialSingleAccountState },
                        },
                      },
                    };
                  }
                  return current; // if no changes, return the current state
                });
              },
  
            setAccountInfo: (network: Mina.Networks, address: ChainAddress, accountInfo: AccountInfo) => {
                set((current) => ({
                  ...current, // <-- spread the outer state
                  state: {
                    ...current.state, // <-- spread the state
                    [network]: {
                      ...current.state[network], // <-- spread the network state
                      [address]: {
                        ...current.state[network][address], // <-- spread the address state
                        accountInfo: accountInfo,
                      },
                    },
                  },
                }));
              },
  
              setTransactions: (network: Mina.Networks, address: ChainAddress, transactions: Mina.TransactionBody[]) => {
                set((current) => ({
                  ...current,
                  state: {
                    ...current.state,
                    [network]: {
                      ...current.state[network],
                      [address]: {
                        ...current.state[network][address],
                        transactions: transactions,
                      },
                    },
                  },
                }));
              },
  
            getAccountInfo: (network: Mina.Networks, address: ChainAddress) => {
              return get().state[network]?.[address] || initialSingleAccountState;
            },
  
            getTransactions: (network: Mina.Networks, address: ChainAddress) => {
              return get().state[network]?.[address]?.transactions || [];
            },
  
            addAccount: (network: Mina.Networks, address: ChainAddress) => {
                set((current) => {
                  if (!current.state[network]) {
                    return { ...current, state: { ...current.state, [network]: {} } };
                  }
                  if (!current.state[network][address]) {
                    return {
                      ...current,
                      state: {
                        ...current.state,
                        [network]: {
                          ...current.state[network],
                          [address]: { ...initialSingleAccountState },
                        },
                      },
                    };
                  }
                  return current; // if no changes, return the current state
                });
              },
  
              removeAccount: (network: Mina.Networks, address: ChainAddress) => {
                set((current) => {
                  const newState = { ...current.state[network] };
                  delete newState[address];
                  return {
                    ...current,
                    state: {
                      ...current.state,
                      [network]: newState,
                    },
                  };
                });
              },
  
          }),
          {
            name: 'PalladAccount',
            storage: createJSONStorage(getSecurePersistence),
          }
        )
      );
    }
  
    setAccountInfo(network: Mina.Networks, address: ChainAddress, accountInfo: AccountInfo) {
      this.store.getState().setAccountInfo(network, address, accountInfo);
    }
  
    setTransactions(network: Mina.Networks, address: ChainAddress, transactions: Mina.TransactionBody[]) {
      this.store.getState().setTransactions(network, address, transactions);
    }
  
    getAccountInfo(network: Mina.Networks, address: ChainAddress): SingleAccountState {
      return this.store.getState().getAccountInfo(network, address);
    }
  
    getTransactions(network: Mina.Networks, address: ChainAddress): Mina.TransactionBody[] {
      return this.store.getState().getTransactions(network, address);
    }
  
    addAccount(network: Mina.Networks, address: ChainAddress): void {
      this.store.getState().addAccount(network, address);
    }
  
    removeAccount(network: Mina.Networks, address: ChainAddress): void {
      this.store.getState().removeAccount(network, address);
    }
  }
  
  export default AccountStore;
  