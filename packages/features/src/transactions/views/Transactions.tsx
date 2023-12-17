import { useNavigate } from 'react-router-dom'

import { ListSkeleton } from '@/components/list-skeleton'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useTransactions } from '../../common/hooks/useTransactions'
import { TransactionsList } from '../components/TransactionsList'
import { useAccount } from '@/common/hooks/useAccount'

export const TransactionsView = () => {
  const navigate = useNavigate()
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions()
  const { isLoading: accountLoading } = useAccount()
  const loading = transactionsLoading || accountLoading
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Transactions"
          button={{ label: 'Send', onClick: () => navigate('/send') }}
        />
        <div className="p-4 pb-12">
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
