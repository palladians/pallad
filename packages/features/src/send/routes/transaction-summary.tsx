import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAccount } from '@/common/hooks/use-account'
import { useTransactionStore } from '@/common/store/transaction'

import { TransactionSummaryView } from '../views/transaction-summary'

export const TransactionSummaryRoute = () => {
  const navigate = useNavigate()
  const { publicKey } = useAccount()
  if (!publicKey) return null
  const outgoingTransaction = useTransactionStore(
    (state) => state.outgoingTransaction
  )
  const kind = useTransactionStore((state) => state.kind)
  if (!outgoingTransaction) return null
  const total = useMemo(
    () =>
      outgoingTransaction?.amount &&
      outgoingTransaction?.fee &&
      outgoingTransaction.amount + outgoingTransaction.fee,
    []
  )
  return (
    <TransactionSummaryView
      onGoBack={() => navigate(-1)}
      transaction={{
        amount: outgoingTransaction.amount ?? '0',
        fee: outgoingTransaction.fee,
        from: publicKey,
        to: outgoingTransaction.to,
        kind: kind,
        total: total ?? '0'
      }}
    />
  )
}
