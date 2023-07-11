//import { produce } from 'immer'
//import { persist } from 'zustand/middleware'
//import { createJSONStorage } from 'zustand/vanilla'

import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { create } from 'zustand'

//import { getSecurePersistence } from '../lib/storage'
import { Store } from './types'
import { VaultStore } from './vault'

export const accountStore = create<Store>((set) => ({
  accountInfo: {
    balance: { total: 0 },
    nonce: 0,
    inferredNonce: 0,
    delegate: '',
    publicKey: ''
  },
  transactions: [],
  setAccountInfo: (accountInfo: AccountInfo) => set({ accountInfo }),
  setTransactions: (transactions: Mina.TransactionBody[]) =>
    set({ transactions })
}))

// define the initial state
const initialState: VaultStore = {
  keyAgent: null,
  restoreWallet: async () => null,
  addCredentials: async () => Promise.resolve()
}

// Zustand store using immer for immutable updates and persist middleware
export const keyAgentStore = create<VaultStore>((set, get) => ({
  keyAgent: initialState.keyAgent,
  restoreWallet: async ({ mnemonic, getPassword }) => {
    const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords({
      getPassphrase: getPassword,
      mnemonicWords: mnemonic
    } as FromBip39MnemonicWordsProps)

    set({ keyAgent })
    return keyAgent
  },
  addCredentials: async ({
    account_ix,
    address_ix,
    network,
    networkType,
    pure
  }) => {
    const keyAgent = get().keyAgent
    if (keyAgent) {
      await keyAgent.deriveCredentials(
        { account_ix },
        { address_ix },
        network,
        networkType,
        pure
      )
    }
  }
}))

/*
export const useStore = create<KeyAgentStore>(persist(
  (set) => ({
    // Initial values for required properties
    serializableKeyAgentData: initialState.serializableKeyAgentData,
    // Mutators
    setAccountInfo: (accountInfo) => set((state) => {
      state.accountInfo = accountInfo;
    }),
    setTransactions: (transactions) => set((state) => {
      state.transactions = transactions;
    }),
    restoreWallet: async ({
      walletName,
      mnemonic,
      network,
      accountNumber,
      accountIndex
    }: {
      walletName: string
      mnemonic: string
      network: Network
      accountNumber: number
      accountIndex: number
    }): Promise<SerializableKeyAgentData | null> => {
      const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords({
        getPassphrase: async () => new Uint8Array(), // TODO: Add your getPassphrase logic
        mnemonicWords: mnemonic.split(' ')
      } as FromBip39MnemonicWordsProps);

      if (!keyAgent) {
        return null;
      }

      // Logic to restore wallet
      return keyAgent.serializableData;
    },
    reset: () => set(() => ({ ...initialState })),
  }),
  {
    name: 'PalladVault',
    getStorage: () => createJSONStorage(), // custom storage (optional)
  },
));*/

// dont forget the hook!
