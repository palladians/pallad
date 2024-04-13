import { ChainAddress } from '@palladxyz/key-management'
import { AccountInfo, Tx } from '@palladxyz/pallad-core'

export type SingleAccountState = {
  accountInfo: Record<string, AccountInfo>
  transactions: Record<string, Tx[]>
}

export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

export type AccountState = {
  // this should be a record Record<string, ChainAddressMapping> where the string is a network
  accounts: Record<string, ChainAddressMapping>
}

// TODO: refactor to integrate custom tokens
export type AccountActions = {
  ensureAccount: (network: string, address: ChainAddress) => void
  // todo: this should be `setAccountsInfo` because it does multiple accounts
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
    transactions: Record<string, Tx[]>
  ) => void
  getAccountsInfo: (
    network: string,
    address: ChainAddress
  ) => SingleAccountState
  getAccountInfo: (
    network: string,
    address: ChainAddress,
    ticker: string // we can add a ticker here to get the account info for a specific token
  ) => AccountInfo

  getTransactions: (
    network: string,
    address: ChainAddress,
    ticker: string // we can add a ticker here to get the account info for a specific token
  ) => Tx[]

  getTransaction: (
    network: string,
    address: ChainAddress,
    hash: string,
    ticker: string
  ) => Tx | undefined

  addAccount: (network: string, address: ChainAddress) => void

  removeAccount: (network: string, address: ChainAddress) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
