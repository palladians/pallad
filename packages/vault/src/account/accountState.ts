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
  ensureAccount: (network: string, address: ChainAddress) => void
  setAccountInfo: (
    network: string,
    address: ChainAddress,
    accountInfo: Record<string, AccountInfo>,
  ) => void

  setTransactions: (
    network: string,
    address: ChainAddress,
    transactions: Record<string, Tx[]>,
  ) => void
  getAccountsInfo: (
    networkId: string,
    address: ChainAddress,
  ) => SingleAccountState
  getAccountInfo: (
    network: string,
    address: ChainAddress,
    ticker: string,
  ) => AccountInfo

  getTransactions: (
    network: string,
    address: ChainAddress,
    ticker: string,
  ) => Tx[]

  getTransaction: (
    network: string,
    address: ChainAddress,
    hash: string,
    ticker: string,
  ) => Tx | undefined

  addAccount: (network: string, address: ChainAddress) => void

  removeAccount: (network: string, address: ChainAddress) => void

  clear: () => void
}

export type AccountStore = AccountState & AccountActions
