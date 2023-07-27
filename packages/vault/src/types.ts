import { GroupedCredentials } from '@palladxyz/key-management-agnostic'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

export type Store = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
  setAccountInfo: (newAccountInfo: AccountInfo) => void
  setTransactions: (newTransactions: Mina.TransactionBody[]) => void
}

export type KeyAgentStore = {
  walletName: string
  restoreWallet: (walletName: string) => Promise<void>
  addCredentials: (walletName: string) => Promise<GroupedCredentials | null>
  setCurrentWallet: (walletName: string) => void
  getCurrentWallet: () => GroupedCredentials | null
  getCredentials: () => GroupedCredentials[] | null
}
