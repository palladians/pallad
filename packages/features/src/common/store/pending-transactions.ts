import { getLocalPersistence } from '@palladxyz/persistence'
import { isBefore } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type PendingTransaction = {
  hash: string
  expireAt: string
}

type PendingTransactionsState = {
  pendingTransactions: PendingTransaction[]
}

type PendingTransactionsActions = {
  addPendingTransaction: (pendingTransaction: PendingTransaction) => void
  removePendingTransaction: (hash: string) => void
  clearExpired: () => void
}

type PendingTransactionsStore = PendingTransactionsState &
  PendingTransactionsActions

const initialState: PendingTransactionsState = {
  pendingTransactions: []
}

export const usePendingTransactionStore = create<PendingTransactionsStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addPendingTransaction: (pendingTransaction) =>
        set((state) => ({
          pendingTransactions: [
            ...state.pendingTransactions,
            pendingTransaction
          ]
        })),
      removePendingTransaction: (hash) =>
        set((state) => ({
          pendingTransactions: state.pendingTransactions.filter(
            (tx) => tx.hash !== hash
          )
        })),
      clearExpired() {
        const { pendingTransactions } = get()
        const validPendingTransactions = pendingTransactions.filter(
          (tx) => !isBefore(new Date(tx.expireAt), new Date())
        )
        return set({ pendingTransactions: validPendingTransactions })
      }
    }),
    {
      name: 'PalladPendingTransactions',
      storage: createJSONStorage(getLocalPersistence)
    }
  )
)
