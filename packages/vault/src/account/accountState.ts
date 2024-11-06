import type { ChainAddress } from "@palladxyz/key-management"
import type { AccountInfo, Tx } from "@palladxyz/pallad-core"

export type SingleAccountState = {
  accountInfo: Record<string, AccountInfo>
  transactions: Record<string, Tx[]>
}

export type ChainAddressMapping = Record<ChainAddress, SingleAccountState>

export type AccountState = {
  accounts: Record<string, ChainAddressMapping>
}

export type AccountActions = {
  ensureAccount: (networkId: string, address: ChainAddress) => void
  setAccountInfo: (
    networkId: string,
    address: ChainAddress,
    accountInfo: Record<string, AccountInfo>,
  ) => void

  setTransactions: (
    networkId: string,
    address: ChainAddress,
    transactions: Record<string, Tx[]>,
  ) => void
  getAccountsInfo: (
    networkId: string,
    address: ChainAddress,
  ) => SingleAccountState
  getAccountInfo: (
    networkId: string,
    address: ChainAddress,
    ticker: string,
  ) => AccountInfo

  getTransactions: (
    networkId: string,
    address: ChainAddress,
    ticker: string,
  ) => Tx[]

  getTransaction: (
    networkId: string,
    address: ChainAddress,
    hash: string,
    ticker: string,
  ) => Tx | undefined

  addAccount: (networkId: string, address: ChainAddress) => void

  removeAccount: (networkId: string, address: ChainAddress) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
