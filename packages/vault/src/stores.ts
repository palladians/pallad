//import { produce } from 'immer'
//import { persist } from 'zustand/middleware'
//import { createJSONStorage } from 'zustand/vanilla'

import {
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  KeyAgentType
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { createStore } from 'zustand/vanilla'

import { Store } from './types'
import { NetworkArgs, VaultStore } from './vault'

export const accountStore = createStore<Store>((set) => ({
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
  addCredentials: async () => null,
  serializableKeyAgentData: {
    __typename: KeyAgentType.InMemory,
    encryptedSeedBytes: new Uint8Array([]),
    knownCredentials: []
  }
}

// Zustand store using immer for immutable updates and persist middleware
export const keyAgentStore = createStore<VaultStore>((set, get) => ({
  keyAgent: initialState.keyAgent,
  serializableKeyAgentData: initialState.serializableKeyAgentData,
  restoreWallet: async (
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    { network, networkType }: NetworkArgs
  ) => {
    const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords({
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords
    })
    // set both the keyAgent and the serializableKeyAgentData
    set({ keyAgent, serializableKeyAgentData: keyAgent.serializableData })

    // derive the credentials for the first account and address & mutate the serializableKeyAgentData state
    await get().addCredentials({
      account_ix: 0,
      address_ix: 0,
      network: network,
      networkType: networkType,
      pure: false
    })

    return keyAgent
  },
  addCredentials: async ({
    account_ix,
    address_ix,
    network,
    networkType,
    pure
  }): Promise<GroupedCredentials | null> => {
    const serializableKeyAgentData = get().serializableKeyAgentData
    const { knownCredentials } = serializableKeyAgentData

    // Find if the credentials already exist in knownCredentials based on the function's arguments
    const existingCredential = knownCredentials.find(
      (knownCredential) =>
        knownCredential.accountIndex === account_ix &&
        knownCredential.addressIndex === address_ix &&
        knownCredential.chain === network
    )

    // If credentials already exist, return the existing credential
    if (existingCredential) {
      return existingCredential
    }

    const keyAgent = get().keyAgent
    if (keyAgent) {
      const credential = await keyAgent.deriveCredentials(
        { account_ix },
        { address_ix },
        network,
        networkType,
        pure
      )

      // Add new credential to knownCredentials
      set({
        serializableKeyAgentData: {
          ...serializableKeyAgentData,
          knownCredentials: [...knownCredentials, credential]
        }
      })
      return credential
    }
    return null
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
