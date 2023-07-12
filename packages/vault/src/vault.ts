/**
 * Module providing the logic for creating and managing KeyAgent credentials and related actions.
 * @module @palladxyz/features
 */

import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  Network,
  SerializableKeyAgentData
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'

/**
 * Type representing a public credential.
 * @typedef {Object} PublicCredential
 * @property {string} walletName - Name of the wallet
 * @property {SerializableKeyAgentData} serializableKeyAgentData - Serializable KeyAgent data of the wallet
 */
export type PublicCredential = {
  walletName: string
  serializableKeyAgentData: SerializableKeyAgentData
}

/**
 * Type representing the state of the vault.
 * @typedef {Object} VaultState
 * @property {SerializableKeyAgentData} serializableKeyAgentData - Serializable KeyAgent data of the vault
 */
export type VaultState = {
  keyAgent: InMemoryKeyAgent | null
}

/**
 * Type representing the mutators for the vault state.
 * @typedef {Object} VaultMutators
 * @property {(walletName: string, mnemonic: string, network: Network, accountNumber: number, accountIndex: number) => Promise<InMemoryKeyAgent | null>} restoreWallet - Function to restore a wallet
 * @property {() => void} reset - Function to reset the state
 */
type VaultMutators = {
  restoreWallet: ({
    mnemonicWords,
    getPassphrase
  }: FromBip39MnemonicWordsProps) => Promise<InMemoryKeyAgent | null>
  addCredentials: ({
    account_ix,
    address_ix,
    network,
    networkType,
    pure
  }: {
    account_ix: number
    address_ix: number
    network: Network
    networkType: Mina.NetworkType
    pure: boolean
  }) => Promise<void>
}

/**
 * Type representing the vault store.
 * @typedef {Object} VaultStore
 * @property {SerializableKeyAgentData} serializableKeyAgentData - Serializable KeyAgent data of the vault
 */
export type VaultStore = VaultState & VaultMutators
