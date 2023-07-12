import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

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

export const transactionStore = createStore<TransactionStore>()((set) => ({
  ...initialState,
  set(outgoingTransaction) {
    return set({ outgoingTransaction })
  },
  reset() {
    return set(initialState)
  }
}))

export const useTransactionStore = (selector: any) =>
  useStore(transactionStore, selector)
