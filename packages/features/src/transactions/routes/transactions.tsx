import { useEffect } from "react"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactions } from "@/common/hooks/use-transactions"
import { usePendingTransactionStore, useVault } from "@palladxyz/vault"

import { useFiatPrice } from "@palladxyz/offchain-data"
import { TransactionsView } from "../views/transactions"

export const TransactionsRoute = () => {
  const { publicKey } = useAccount()
  const { current: rawFiatPrice } = useFiatPrice()
  const currentNetworkInfo = useVault((state) => state.getCurrentNetworkInfo())
  const clearExpired = usePendingTransactionStore((state) => state.clearExpired)
  const { data: transactions, error: transactionsError } = useTransactions()
  const pendingHashes = usePendingTransactionStore((state) =>
    state.pendingTransactions
      .map((tx) => tx.hash)
      .filter((hash) => !transactions?.map((tx) => tx.hash).includes(hash)),
  )
  const openPendingTransactions = () => {
    const url = currentNetworkInfo.explorer.accountUrl.replace(
      "{publicKey}",
      publicKey,
    )
    window.open(`${url}/txs`, "_blank")?.focus()
  }
  // biome-ignore lint: only run on first render
  useEffect(() => {
    clearExpired()
  }, [])
  return (
    <TransactionsView
      fiatPrice={rawFiatPrice}
      pendingHashes={pendingHashes}
      publicKey={publicKey}
      transactions={transactions ?? []}
      transactionsError={transactionsError}
      openPendingTransactions={openPendingTransactions}
    />
  )
}
