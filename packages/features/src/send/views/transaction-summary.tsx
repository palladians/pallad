import { ArrowDownLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAccount } from '@/common/hooks/use-account'
import { truncateString } from '@/common/lib/string'
import { useTransactionStore } from '@/common/store/transaction'
import { AppLayout } from '@/components/app-layout'
import { MetaField } from '@/components/meta-field'
import { Card } from '@/components/ui/card'
import { ViewHeading } from '@/components/view-heading'

import { ConfirmTransactionForm } from '../components/confirm-transaction-form'

export const TransactionSummaryView = () => {
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
      parseFloat(outgoingTransaction?.amount) +
        parseFloat(outgoingTransaction.fee),
    []
  )
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col">
        <ViewHeading
          title="Transaction Summary"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card className="flex flex-col relative p-2 gap-2 rounded-[1rem]">
            <div className="flex absolute right-4 h-full items-center justify-center text-blue-500">
              <ArrowDownLeftIcon />
            </div>
            <MetaField
              label="From"
              value={
                (publicKey &&
                  truncateString({
                    value: publicKey,
                    endCharCount: 8,
                    firstCharCount: 8
                  })) ||
                ''
              }
            />
            <MetaField
              label="To"
              value={
                (outgoingTransaction?.to &&
                  truncateString({
                    value: outgoingTransaction.to,
                    endCharCount: 8,
                    firstCharCount: 8
                  })) ||
                ''
              }
            />
          </Card>
          <Card className="grid grid-cols-2 gap-4 p-2 rounded-[1rem]">
            <MetaField label="Kind" value={kind} capitalize />
            {outgoingTransaction.amount && (
              <MetaField
                label="Amount"
                value={`${outgoingTransaction.amount} MINA`}
              />
            )}
            <MetaField label="Fee" value={`${outgoingTransaction.fee} MINA`} />
            {outgoingTransaction?.amount && (
              <MetaField label="Total" value={`${total} MINA`} /> // TODO: this will not always be 'MINA'
            )}
          </Card>
          <ConfirmTransactionForm />
        </div>
      </div>
    </AppLayout>
  )
}
