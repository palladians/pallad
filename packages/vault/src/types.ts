import { AccountInfo, Mina } from '@palladxyz/mina-core'

export type Store = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
  setAccountInfo: (newAccountInfo: AccountInfo) => void
  setTransactions: (newTransactions: Mina.TransactionBody[]) => void
}
