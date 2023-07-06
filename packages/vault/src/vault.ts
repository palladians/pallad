/**
 * Module providing the logic for creating and managing wallet credentials and related actions.
 * @module @palladxyz/features
 */

import { Network } from '@palladxyz/key-generator'

/**
 * Type representing a public credential.
 * @typedef {Object} PublicCredential
 * @property {string} walletName - Name of the wallet
 * @property {string} walletPublicKey - Public key of the wallet
 */

export type PublicCredential = {
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

export type Credential = PublicCredential & {
  walletPrivateKey: string
}

/**
 * Type representing the state of the vault.
 * @typedef {Object} VaultState
 * @property {string|null} currentWalletPublicKey - Public key of the current wallet
 * @property {Array.<Credential>} credentials - Array of credentials
 */

export type VaultState = {
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

export type VaultStore = VaultState & VaultMutators
