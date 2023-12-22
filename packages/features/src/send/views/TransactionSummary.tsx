import { ArrowDownLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'
import { truncateString } from '../../common/lib/string'
import { useTransactionStore } from '../../common/store/transaction'
import { ConfirmTransactionForm } from '../components/ConfirmTransactionForm'

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
              <MetaField label="Total" value={`${total} MINA`} />
            )}
          </Card>
          <ConfirmTransactionForm />
        </div>
      </div>
    </AppLayout>
  )
}
