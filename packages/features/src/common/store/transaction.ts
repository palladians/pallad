import { create } from 'zustand'

import { OutgoingTransaction } from '../types'

type TxKind = 'transaction' | 'staking'

type TransactionState = {
  outgoingTransaction: OutgoingTransaction | null
  kind: TxKind
}

type TransactionMutators = {
  set: (outgoingTransaction: OutgoingTransaction) => void
  setKind: (kind: TxKind) => void
}

type TransactionStore = TransactionState & TransactionMutators

const initialState = {
  outgoingTransaction: null
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  ...initialState,
  kind: 'transaction',
  set(outgoingTransaction) {
    return set({ outgoingTransaction })
  },
  setKind: (kind) => set({ kind }),
  reset() {
    return set(initialState)
  }
}))
