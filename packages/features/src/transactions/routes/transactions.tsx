import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactions } from "@/common/hooks/use-transactions"
import { usePendingTransactionStore } from "@/common/store/pending-transactions"

import { TransactionsView } from "../views/transactions"

export const TransactionsRoute = () => {
  const navigate = useNavigate()
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions()
  const { isLoading: accountLoading } = useAccount()
  const loading = transactionsLoading || accountLoading
  const pendingTransactions = usePendingTransactionStore(
    (state) => state.pendingTransactions,
  )
  const clearExpired = usePendingTransactionStore((state) => state.clearExpired)
  const transactionHashes = transactions?.map((tx) => tx.hash) || []
  const onlyPendingTransactions = pendingTransactions.filter(
    (tx) => !transactionHashes.includes(tx.hash),
  )
  // biome-ignore lint: only run on first render
  useEffect(() => {
    clearExpired()
  }, [])
  return (
    <TransactionsView
      loading={loading}
      onGoBack={() => navigate(-1)}
      transactions={transactions ?? []}
      onlyPendingTransactions={onlyPendingTransactions ?? []}
    />
  )
}
