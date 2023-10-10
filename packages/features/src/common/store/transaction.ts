import { create } from 'zustand'

import { OutgoingTransaction } from '../types'

type TransactionState = {
  outgoingTransaction: OutgoingTransaction | null
}

type TransactionMutators = {
  set: (outgoingTransaction: OutgoingTransaction) => void
}

type TransactionStore = TransactionState & TransactionMutators

const initialState = {
  outgoingTransaction: null
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  ...initialState,
  set(outgoingTransaction) {
    return set({ outgoingTransaction })
  },
  reset() {
    return set(initialState)
  }
}))
