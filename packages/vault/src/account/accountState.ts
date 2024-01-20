import { ChainAddress } from '@palladxyz/key-management'
import { Multichain } from '@palladxyz/multi-chain-core'

export type SingleAccountState = {
  accountInfo: Multichain.MultiChainAccountInfo
  transactions: Multichain.MultiChainTransactionBody[]
}

export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

export type AccountState = {
  accounts: Record<Multichain.MultiChainNetworks, ChainAddressMapping>
}

// TODO: refactor to integrate custom tokens
export type AccountActions = {
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
  ) => SingleAccountState

  getTransactions: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => Multichain.MultiChainTransactionBody[]

  getTransaction: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    hash: string
  ) => Multichain.MultiChainTransactionBody | undefined

  addAccount: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  removeAccount: (
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
