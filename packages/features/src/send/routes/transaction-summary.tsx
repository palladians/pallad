import { useMemo } from "react"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactionStore } from "@/common/store/transaction"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
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
  const type = useTransactionStore((state) => state.type)
  const confirmationForm = useForm<ConfirmTransactionData>({
    resolver: zodResolver(ConfirmTransactionSchema as any),
    defaultValues: {
      spendingPassword: "",
    },
  })
  const { submitTransaction } = useTransactionConfirmation({
    confirmationForm,
  })
  const total = useMemo(
    () => (outgoingTransaction?.amount ?? 0) + (outgoingTransaction?.fee ?? 0),
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
        type,
        total: total ?? 0,
      }}
      submitTransaction={submitTransaction}
      onGoBack={() => navigate(-1)}
      onClose={() => navigate("/dashboard")}
    />
  )
}
