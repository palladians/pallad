import {
  ChainSpecificArgs,
  ChainSpecificPayload_,
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management-agnostic'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { Store } from './types'
import { VaultStore } from './vault'

// this is a Mina specific store, we will need to refactor this to be agnostic
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
  addCredentials: async () => void 0
}

// Zustand store using immer for immutable updates and persist middleware
export const keyAgentStore = createStore<VaultStore>()(
  persist(
    (set, get) => ({
      keyAgent: initialState.keyAgent,
      restoreWallet: async <T extends ChainSpecificPayload_>(
        payload: T,
        args: ChainSpecificArgs,
        { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
      ) => {
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)

        // set both the keyAgent and the serializableKeyAgentData
        set({ keyAgent })

        // derive the credentials for the first account and address & mutate the serializableKeyAgentData state
        await get().addCredentials(payload, args, false)

        return keyAgent
      },
      addCredentials: async <T extends ChainSpecificPayload_>(
        payload: T,
        args: ChainSpecificArgs,
        pure?: boolean
      ): Promise<void> => {
        const keyAgent = get().keyAgent ? get().keyAgent : null

        if (keyAgent) {
          await keyAgent.deriveCredentials(payload, args, pure)
          // Add new credential to knownCredentials
          set({ keyAgent })
        } else {
          console.log('keyAgent is null')
        }
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)

/* // old keyAgentStore
export const keyAgentStore = createStore<VaultStore>()(
  persist(
    (set, get) => ({
      keyAgent: initialState.keyAgent,
      restoreWallet: async (
        { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
        { network, networkType }: NetworkArgs
      ) => {
        const keyAgent = await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords
        })
        // set both the keyAgent and the serializableKeyAgentData
        set({ keyAgent })

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
        const keyAgent = get().keyAgent ? get().keyAgent : null

        if (keyAgent) {
          const { knownCredentials } = keyAgent.serializableData

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

          console.log(
            'deriving credentials for account_ix',
            account_ix,
            'address_ix',
            address_ix
          )
          const credential = await keyAgent.deriveCredentials(
            { account_ix },
            { address_ix },
            network,
            networkType,
            pure
          )
          console.log(
            'derived credentials for account_ix',
            account_ix,
            'address_ix',
            address_ix,
            'credential',
            credential
          )

          // Add new credential to knownCredentials
          keyAgent.knownCredentials = [...knownCredentials, credential]
          set({ keyAgent })
          return credential
        }
        return null
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)*/

// dont forget the hook!
