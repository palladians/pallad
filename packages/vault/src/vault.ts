/**
 * Module providing the logic for creating and managing KeyAgent credentials and related actions.
 * @module @palladxyz/features
 */

import {
  ChainAddress,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  Network
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'

export type NetworkArgs = {
  network: Network
  networkType: Mina.NetworkType
}

/**
 * Type representing the state of the account.
 * @typedef {Object} AccountState
 */
export type AccountState = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
}

/**
 * Type representing the mutators for the account state.
 * @typedef {Object} AccountMutators
 */
type AccountMutators = {
  setAccountInfo: (accountInfo: AccountInfo) => void
  setTransactions: (transactions: Mina.TransactionBody[]) => void
  getAccountInfo: () => AccountInfo
  getTransactions: () => Mina.TransactionBody[]
}

/**
 * Type representing the account store.
 * @typedef {Object} AccountStore
 * @property {AccountInfo} accountInfo - Account info of the store
 * @property {Array<Mina.TransactionBody>} transactions - Transactions of the store
 */
export type AccountStore = AccountState & AccountMutators

/**
 * Type representing the state of the vault.
 * @typedef {Object} VaultState
 */
export type VaultState = {
  keyAgent: InMemoryKeyAgent | null
  currentWallet: GroupedCredentials | null
  accountStores: Record<ChainAddress, AccountStore>
}

/**
 * Type representing the mutators for the vault state.
 * @typedef {Object} VaultMutators
 */
type VaultMutators = {
  restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    provider: MinaProvider,
    providerArchive: MinaArchiveProvider,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<InMemoryKeyAgent | null>
  addCredentials: <T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    provider: MinaProvider,
    providerArchive: MinaArchiveProvider,
    pure?: boolean
  ) => Promise<void>
  setCurrentWallet: (address: ChainAddress) => void
  getCurrentWallet: () => GroupedCredentials | null
  getCredentials: () => GroupedCredentials[] | null
  getAccountStore: (address: ChainAddress) => AccountStore | null
  setAccountStore: (
    address: ChainAddress,
    accountStore: Partial<AccountStore>
  ) => void
}

/**
 * Type representing the vault store.
 * @typedef {Object} VaultStore
 * @property {SerializableKeyAgentData} serializableKeyAgentData - Serializable KeyAgent data of the vault
 */
export type VaultStore = VaultState & VaultMutators
