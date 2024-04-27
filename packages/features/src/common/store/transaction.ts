import { Mina } from "@palladxyz/mina-core"
import { create } from "zustand"

import type { OutgoingTransaction } from "../types"

type TransactionState = {
  outgoingTransaction: OutgoingTransaction | null
  kind: Mina.TransactionKind
}

type TransactionMutators = {
  set: (outgoingTransaction: OutgoingTransaction) => void
  setKind: (kind: Mina.TransactionKind) => void
}

type TransactionStore = TransactionState & TransactionMutators

const initialState = {
  outgoingTransaction: null,
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  ...initialState,
  kind: Mina.TransactionKind.PAYMENT,
  set(outgoingTransaction) {
    return set({ outgoingTransaction })
  },
  setKind: (kind) => set({ kind }),
  reset() {
    return set(initialState)
  },
}))
