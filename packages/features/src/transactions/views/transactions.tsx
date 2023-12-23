import { ClockIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAccount } from '@/common/hooks/use-account'
import { useTransactions } from '@/common/hooks/use-transactions'
import { usePendingTransactionStore } from '@/common/store/pending-transactions'
import { AppLayout } from '@/components/app-layout'
import { ListSkeleton } from '@/components/list-skeleton'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { ViewHeading } from '@/components/view-heading'

import { TransactionsList } from '../components/transactions-list'

export const TransactionsView = () => {
  const navigate = useNavigate()
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions()
  const { isLoading: accountLoading } = useAccount()
  const loading = transactionsLoading || accountLoading
  const pendingTransactions = usePendingTransactionStore(
    (state) => state.pendingTransactions
  )
  const clearExpired = usePendingTransactionStore((state) => state.clearExpired)
  const transactionHashes = transactions?.map((tx) => tx.hash) || []
  const onlyPendingTransactions = pendingTransactions.filter(
    (tx) => !transactionHashes.includes(tx.hash)
  )
  useEffect(() => {
    clearExpired()
  }, [])
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Transactions"
          button={{ label: 'Send', onClick: () => navigate('/send') }}
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
}
