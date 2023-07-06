import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { create } from 'zustand'
import {
  generateMnemonic,
  KeyGeneratorFactory,
  Network,
  wordlist
} from '@palladxyz/key-generator'
import { produce } from 'immer'
import { useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { getSecurePersistence } from '../lib/storage'
import { Store } from './types'
import { VaultStore, VaultState, Credential} from './vault'

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

/**
 * The initial state of the vault store.
 */

const initialState: VaultState = {
  currentWalletPublicKey: null,
  credentials: []
} satisfies VaultState


/**
 * Store to manage the state of the vault.
 * @type {VaultStore}
 */

export const vaultStore = createStore<VaultStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      getCurrentWallet() {
        const { currentWalletPublicKey, credentials } = get()
        const wallet = credentials.find(
          (credential) => credential.walletPublicKey === currentWalletPublicKey
        )
        if (!wallet) return null
        return {
          walletName: wallet?.walletName,
          walletPublicKey: wallet?.walletPublicKey
        }
      },
      getAccounts() {
        const { credentials } = get()
        return credentials.map((credential) => credential.walletPublicKey)
      },
      async createWallet({
        walletName,
        network,
        accountNumber
      }: {
        walletName: string
        network: Network
        accountNumber: number
      }) {
        const { addCredential, setCurrentWalletPublicKey } = get()
        const mnemonic = generateMnemonic(wordlist)
        const keyGenerator = KeyGeneratorFactory.create(network)
        const keypair = await keyGenerator.deriveKeyPair({
          mnemonic,
          accountNumber
        })
        if (!keypair) return null
        addCredential({
          walletName,
          walletPublicKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPublicKey({
          currentWalletPublicKey: keypair.publicKey
        })
        return {
          publicKey: keypair.publicKey,
          mnemonic
        }
      },
      async restoreWallet({
        walletName,
        mnemonic,
        network,
        accountNumber
      }: {
        walletName: string
        mnemonic: string
        network: Network
        accountNumber: number
      }) {
        const { addCredential, setCurrentWalletPublicKey } = get()
        const keyGenerator = KeyGeneratorFactory.create(network)
        const keypair = await keyGenerator.deriveKeyPair({
          mnemonic,
          accountNumber
        })
        if (!keypair) return null
        addCredential({
          walletName,
          walletPublicKey: keypair.publicKey,
          walletPrivateKey: keypair.privateKey
        })
        setCurrentWalletPublicKey({
          currentWalletPublicKey: keypair.publicKey
        })
        return {
          publicKey: keypair.publicKey
        }
      },
      setCurrentWalletPublicKey: ({ currentWalletPublicKey }) =>
        set(
          produce((draft: VaultStore) => {
            if (currentWalletPublicKey === null) {
              draft.currentWalletPublicKey = null
              return
            }
            const credentialExists = draft.credentials.find(
              (credential: Credential) =>
                credential.walletPublicKey === currentWalletPublicKey
            )
            if (!credentialExists)
              throw new Error('Given credential does not exist')
            draft.currentWalletPublicKey = currentWalletPublicKey
          })
        ),
      addCredential: (credential) =>
        set(
          produce((draft: VaultStore) => {
            draft.credentials.push(credential)
          })
        ),
      reset() {
        return set(initialState)
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)

/**
 * Hook to use the vault store.
 * @param {any} selector - Selector function to choose which part of the state to subscribe to.
 * @returns {any} Selected state.
 */

export const useVaultStore = (selector: any) => useStore(vaultStore, selector)
