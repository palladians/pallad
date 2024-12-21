import { Mina } from "@palladco/mina-core"
import { create } from "zustand"

import type { OutgoingTransaction } from "../types"

type TransactionState = {
  outgoingTransaction: OutgoingTransaction | null
  type: Mina.TransactionType
}

type TransactionMutators = {
  set: (outgoingTransaction: OutgoingTransaction) => void
  setType: (type: Mina.TransactionType) => void
}

type TransactionStore = TransactionState & TransactionMutators

const initialState = {
  outgoingTransaction: null,
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  ...initialState,
  type: Mina.TransactionType.PAYMENT,
  set(outgoingTransaction) {
    return set({ outgoingTransaction })
  },
  setType: (type) => set({ type }),
  reset() {
    return set(initialState)
  },
}))
