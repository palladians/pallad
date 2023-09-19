/**
 * @file Represents the state definitions related to accounts.
 */

import { ChainAddress } from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

/**
 * Type representing the basic state of an account.
 * @typedef {Object} SingleAccountState
 */
export type SingleAccountState = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
}

/**
 * Constant representing the mutators for a single account state.
 * @typedef {Object} SingleAccountMutators
 */
export const initialSingleAccountState: SingleAccountState = {
  accountInfo: {} as AccountInfo,
  transactions: []
}

/**
 * Type representing the aggregated state of all accounts, indexed by network and then by address.
 * @typedef {Object} AccountStoreState
 */
export type AccountStoreState = {
  // could become accounts: Record<Network, Record<ChainAddress, SingleAccountState>> for network agnostic
  mainnet: Record<ChainAddress, SingleAccountState>
  devnet: Record<ChainAddress, SingleAccountState>
  berkeley: Record<ChainAddress, SingleAccountState>
}

/**
 * Constant representing the initial account states.
 * @typedef {Object} AccountStoreState
 */
export const initialAccountStoreState: AccountStoreState = {
  mainnet: {},
  devnet: {},
  berkeley: {}
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} AccountState
 */
export type AccountState = {
  rehydrate(): unknown
  state: AccountStoreState

  ensureAccount: (network: Mina.Networks, address: ChainAddress) => void

  setAccountInfo: (
    network: Mina.Networks,
    address: ChainAddress,
    accountInfo: AccountInfo
  ) => void

  setTransactions: (
    network: Mina.Networks,
    address: ChainAddress,
    transactions: Mina.TransactionBody[]
  ) => void

  getAccountInfo: (
    network: Mina.Networks,
    address: ChainAddress
  ) => SingleAccountState | typeof initialSingleAccountState

  getTransactions: (
    network: Mina.Networks,
    address: ChainAddress
  ) => Mina.TransactionBody[]

  addAccount: (network: Mina.Networks, address: ChainAddress) => void

  removeAccount: (network: Mina.Networks, address: ChainAddress) => void
}

/**
 * The type of the store returned by createStore.
 * @typedef {Object} AccountStore
 */
export type AccountStores = AccountState
