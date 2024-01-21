import { ChainAddress } from '@palladxyz/key-management'
import { Multichain } from '@palladxyz/multi-chain-core'

// TODO: remove the multichain package from this file
export type SingleAccountState = {
  accountInfo: Multichain.MultiChainAccountInfo
  transactions: Multichain.MultiChainTransactionBody[]
}

// change to something like Record<ChainAddress, Record<ticker, SingleAccountState>>
export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

export type AccountState = {
  // this should be a record Record<string, ChainAddressMapping> where the string is a network
  accounts: Record<Multichain.MultiChainNetworks, ChainAddressMapping>
}

// TODO: refactor to integrate custom tokens
export type AccountActions = {
  ensureAccount: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  setAccountInfo: (
    // this should just be a string
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    // this has to be a record Record<string, AccountInfo> where the string is a ticker of a token
    accountInfo: Multichain.MultiChainAccountInfo
  ) => void

  setTransactions: (
    // this should just be a string
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    // ideally this should be a record Record<string, Transaction[]> where the string is a ticker of a token
    // but for now we only fetch MINA transactions in the chain history provider
    transactions: Multichain.MultiChainTransactionBody[]
  ) => void

  getAccountInfo: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
    // ticker?: string // we can add a ticker here to get the account info for a specific token
  ) => SingleAccountState

  getTransactions: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
    // ticker?: string // we can add a ticker here to get the account info for a specific token
    // remove multichain
  ) => Multichain.MultiChainTransactionBody[]

  getTransaction: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress,
    hash: string
    // no need for multichain
  ) => Multichain.MultiChainTransactionBody | undefined

  addAccount: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  removeAccount: (
    // this should just be a string no need for multichain
    network: Multichain.MultiChainNetworks,
    address: ChainAddress
  ) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
