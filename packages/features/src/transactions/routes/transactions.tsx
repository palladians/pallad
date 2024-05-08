import { useEffect } from "react"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactions } from "@/common/hooks/use-transactions"
import { usePendingTransactionStore } from "@/common/store/pending-transactions"

import { useFiatPrice } from "@palladxyz/offchain-data"
import { TransactionsView } from "../views/transactions"

export const TransactionsRoute = () => {
  const { publicKey } = useAccount()
  const { data: fiatPriceData } = useFiatPrice()
  const clearExpired = usePendingTransactionStore((state) => state.clearExpired)
  const pendingHashes = usePendingTransactionStore(
    (state) => state.pendingTransactions,
  ).map((tx) => tx.hash)
  const { data: transactions, error: transactionsError } = useTransactions()
  // biome-ignore lint: only run on first render
  useEffect(() => {
    clearExpired()
  }, [])
  return (
    <TransactionsView
      fiatPrice={fiatPriceData?.["mina-protocol"].usd || 0}
      pendingHashes={pendingHashes}
      publicKey={publicKey}
      transactions={transactions ?? []}
      transactionsError={transactionsError}
    />
  )
}
