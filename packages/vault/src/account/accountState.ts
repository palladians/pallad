/**
 * @file Represents the state definitions related to accounts.
 */

import { ChainAddress } from '@palladxyz/key-management'
import { Multichain } from '@palladxyz/multi-chain-core'

/**
 * Type representing the basic state of an account.
 * @typedef {Object} SingleAccountState
 */
export type SingleAccountState = {
  accountInfo: Multichain.MultiChainAccountInfo
  transactions: Multichain.MultiChainTransactionBody[]
}

/**
 * Constant representing the mutators for a single account state.
 * @typedef {Object} SingleAccountMutators
 */
export const initialSingleAccountState: SingleAccountState = {
  accountInfo: {} as Multichain.MultiChainAccountInfo,
  transactions: []
}

/**
 * Type representing a mapping of ChainAddress to SingleAccountState.
 */
export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} AccountState
 */
export type AccountState = {
  accounts: Record<Multichain.MultiChainNetworks, ChainAddressMapping>

  ensureAccount: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  setAccountInfo: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    accountInfo: Multichain.MultiChainAccountInfo
  ) => void

  setTransactions: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    transactions: Multichain.MultiChainTransactionBody[]
  ) => void

  getAccountInfo: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => SingleAccountState | typeof initialSingleAccountState

  getTransactions: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => Multichain.MultiChainTransactionBody[]

  addAccount: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  removeAccount: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void
}
