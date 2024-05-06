import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactionStore } from "@/common/store/transaction"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { ConfirmTransactionSchema } from "../components/confirm-transaction-form.schema"
import { useTransactionConfirmation } from "../hooks/use-transaction-confirmation"
import { TransactionSummaryView } from "../views/transaction-summary"

type ConfirmTransactionData = z.infer<typeof ConfirmTransactionSchema>

export const TransactionSummaryRoute = () => {
  const navigate = useNavigate()
  const { publicKey } = useAccount()
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction,
  )
  const kind = useTransactionStore((state) => state.kind)
  const confirmationForm = useForm<ConfirmTransactionData>({
    resolver: zodResolver(ConfirmTransactionSchema),
    defaultValues: {
      spendingPassword: "",
    },
  })
  const { submitTransaction } = useTransactionConfirmation({
    confirmationForm,
  })
  const total = useMemo(
    () =>
      outgoingTransaction?.amount &&
      outgoingTransaction?.fee &&
      (outgoingTransaction.amount ?? 0) + (outgoingTransaction.fee ?? 0),
    [outgoingTransaction?.fee, outgoingTransaction?.amount],
  )
  if (!outgoingTransaction) return null
  return (
    <TransactionSummaryView
      confirmationForm={confirmationForm}
      transaction={{
        amount: outgoingTransaction.amount ?? 0,
        fee: outgoingTransaction.fee,
        from: publicKey,
        to: outgoingTransaction.to,
        kind: kind,
        total: total ?? 0,
      }}
      submitTransaction={submitTransaction}
    />
  )
}
