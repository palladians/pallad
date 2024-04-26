import type { Mina } from "@palladxyz/mina-core"
import { ClockIcon } from "lucide-react"

import { AppLayout } from "@/components/app-layout"
import { ListSkeleton } from "@/components/list-skeleton"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { ViewHeading } from "@/components/view-heading"

import { TransactionsList } from "../components/transactions-list"

type PendingTransaction = {
  hash: string
  expireAt: string
}

type TransactionsViewProps = {
  onGoBack: () => void
  loading: boolean
  transactions: Mina.TransactionBody[]
  onlyPendingTransactions: PendingTransaction[]
}

export const TransactionsView = ({
  onGoBack,
  loading,
  transactions,
  onlyPendingTransactions,
}: TransactionsViewProps) => (
  <AppLayout>
    <div className="flex flex-col flex-1">
      <ViewHeading
        title="Transactions"
        button={{ label: "Send", onClick: onGoBack }}
      />
      <div className="fle flex-col gap-4 p-4 pb-12">
        {onlyPendingTransactions.length > 0 && (
          <Alert
            className="mb-4 rounded-[1rem] p-2"
            data-testid="transactions__pendingTransactions"
          >
            <ClockIcon className="h-6 w-6" />
            <AlertTitle className="leading-6 ml-4">
              There are transactions waiting to be broadcasted.
            </AlertTitle>
          </Alert>
        )}
        {loading ? (
          <ListSkeleton />
        ) : (
          transactions && <TransactionsList transactions={transactions} />
        )}
      </div>
    </div>
  </AppLayout>
)
