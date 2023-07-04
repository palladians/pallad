import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { create } from 'zustand'

export const useStore = create<Store>((set) => ({
  accountInfo: {
    balance: { total: 0 },
    nonce: 0,
    inferredNonce: 0,
    delegate: '',
    publicKey: ''
  },
  transactions: [],
  setAccountInfo: (accountInfo: AccountInfo) => set({ accountInfo }),
  setTransactions: (transactions: Mina.TransactionBody[]) =>
    set({ transactions })
}))

export type Store = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
  setAccountInfo: (newAccountInfo: AccountInfo) => void
  setTransactions: (newTransactions: Mina.TransactionBody[]) => void
}
