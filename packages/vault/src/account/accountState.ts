import { ChainAddress } from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

// TODO: remove the multichain package from this file
export type SingleAccountState = {
  accountInfo: Record<string, AccountInfo>
  transactions: Record<string, Mina.TransactionBody[]>
}

export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

export type AccountState = {
  // this should be a record Record<string, ChainAddressMapping> where the string is a network
  accounts: Record<string, ChainAddressMapping>
}

// TODO: refactor to integrate custom tokens
export type AccountActions = {
  ensureAccount: (
    // ✅ this should just be a string no need for multichain
    network: string,
    address: ChainAddress
  ) => void

  setAccountInfo: (
    // ✅ this should be a string
    network: string,
    address: ChainAddress,
    // ✅ this has to be a record Record<string, AccountInfo> where the string is a ticker of a token
    accountInfo: Record<string, AccountInfo>
  ) => void

  setTransactions: (
    // ✅ this should just be a string
    network: string,
    address: ChainAddress,
    // ideally this should be a record Record<string, Transaction[]> where the string is a ticker of a token
    // but for now we only fetch MINA transactions in the chain history provider
    transactions: Record<string, Mina.TransactionBody[]>
  ) => void

  getAccountInfo: (
    // ✅ this should just be a string no need for multichain & change to networkName
    network: string,
    address: ChainAddress
  ) => SingleAccountState

  getTransactions: (
    // this should just be a string no need for multichain
    network: string,
    address: ChainAddress,
    ticker: string // we can add a ticker here to get the account info for a specific token
    // remove multichain
  ) => Mina.TransactionBody[]

  getTransaction: (
    // this should just be a string no need for multichain
    network: string,
    address: ChainAddress,
    hash: string,
    ticker: string
    // no need for multichain
  ) => Mina.TransactionBody | undefined

  addAccount: (
    // this should just be a string no need for multichain
    network: string,
    address: ChainAddress
  ) => void

  removeAccount: (
    // this should just be a string no need for multichain
    network: string,
    address: ChainAddress
  ) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
