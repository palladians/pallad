import { ArrowDownLeftIcon } from "lucide-react"

import { truncateString } from "@/common/lib/string"
import { AppLayout } from "@/components/app-layout"
import { MetaField } from "@/components/meta-field"
import { ViewHeading } from "@/components/view-heading"

import { ConfirmTransactionForm } from "../components/confirm-transaction-form"

type TransactionSummaryViewProps = {
  onGoBack: () => void
  transaction: {
    from: string
    to: string
    amount: string
    fee: string
    kind: string
    total: string
  }
}

export const TransactionSummaryView = ({
  onGoBack,
  transaction,
}: TransactionSummaryViewProps) => (
  <AppLayout>
    <div className="flex flex-1 flex-col">
      <ViewHeading
        title="Transaction Summary"
        backButton={{ onClick: onGoBack }}
      />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex absolute right-4 h-full items-center justify-center text-blue-500">
          <ArrowDownLeftIcon />
        </div>
        <MetaField
          label="From"
          value={
            (transaction.from &&
              truncateString({
                value: transaction.from,
                endCharCount: 8,
                firstCharCount: 8,
              })) ||
            ""
          }
        />
        <MetaField
          label="To"
          value={
            (transaction.to &&
              truncateString({
                value: transaction.to,
                endCharCount: 8,
                firstCharCount: 8,
              })) ||
            ""
          }
        />
        <MetaField label="Kind" value={transaction.kind} capitalize />
        {transaction.amount && (
          <MetaField label="Amount" value={`${transaction.amount} MINA`} />
        )}
        <MetaField label="Fee" value={`${transaction.fee} MINA`} />
        {transaction.amount && (
          <MetaField label="Total" value={`${transaction.total} MINA`} /> // TODO: this will not always be 'MINA'
        )}
        <ConfirmTransactionForm />
      </div>
    </div>
  </AppLayout>
)
