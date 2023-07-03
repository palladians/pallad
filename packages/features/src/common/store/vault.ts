/**
 * Module providing the logic for creating and managing wallet credentials and related actions.
 * @module @palladxyz/features
 */

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

/**
 * Type representing a public credential.
 * @typedef {Object} PublicCredential
 * @property {string} walletName - Name of the wallet
 * @property {string} walletPublicKey - Public key of the wallet
 */

type PublicCredential = {
  walletName: string
  walletPublicKey: string
}

/**
 * Type representing a credential.
 * @typedef {Object} Credential
 * @property {string} walletName - Name of the wallet
 * @property {string} walletPublicKey - Public key of the wallet
 * @property {string} walletPrivateKey - Private key of the wallet
 */

type Credential = PublicCredential & {
  walletPrivateKey: string
}

/**
 * Type representing the state of the vault.
 * @typedef {Object} VaultState
 * @property {string|null} currentWalletPublicKey - Public key of the current wallet
 * @property {Array.<Credential>} credentials - Array of credentials
 */

type VaultState = {
  currentWalletPublicKey: string | null
  credentials: Credential[]
}

/**
 * Type representing the mutators for the vault state.
 * @typedef {Object} VaultMutators
 * @property {(currentWalletPublicKey: string|null) => void} setCurrentWalletPublicKey - Function to set the current wallet's public key
 * @property {(credential: Credential) => void} addCredential - Function to add a credential
 * @property {() => string[]} getAccounts - Function to get all accounts
 * @property {() => PublicCredential | null} getCurrentWallet - Function to get the current wallet
 * @property {(walletName: string, network: Network, accountNumber: number) => Promise<{ publicKey: string; mnemonic: string } | null>} createWallet - Function to create a wallet
 * @property {(walletName: string, mnemonic: string, network: Network, accountNumber: number) => Promise<{ publicKey: string } | null>} restoreWallet - Function to restore a wallet
 * @property {() => void} reset - Function to reset the state
 */

type VaultMutators = {
  setCurrentWalletPublicKey: ({
    currentWalletPublicKey
  }: {
    currentWalletPublicKey: string | null
  }) => void
  addCredential: (credential: Credential) => void
  getAccounts: () => string[]
  getCurrentWallet: () => PublicCredential | null
  createWallet: ({
    walletName,
    network,
    accountNumber
  }: {
    walletName: string
    network: Network
    accountNumber: number
  }) => Promise<{ publicKey: string; mnemonic: string } | null>
  restoreWallet: ({
    walletName,
    mnemonic,
    network,
    accountNumber
  }: {
    walletName: string
    mnemonic: string
    network: Network
    accountNumber: number
  }) => Promise<{ publicKey: string } | null>
  reset: () => void
}

/**
 * Type representing the vault store.
 * @typedef {Object} VaultStore
 * @property {string|null} currentWalletPublicKey - Public key of the current wallet
 * @property {Array.<Credential>} credentials - Array of credentials
 */

type VaultStore = VaultState & VaultMutators

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
