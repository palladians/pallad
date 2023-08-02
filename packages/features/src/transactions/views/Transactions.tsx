import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useTransactions } from '../../common/hooks/useTransactions'

export const TransactionsView = () => {
  const navigate = useNavigate()
  const { data: transactions } = useTransactions()
  console.log('>>>T', transactions)
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Transactions"
          button={{ label: 'Send', onClick: () => navigate('/send') }}
        />
      </div>
    </AppLayout>
  )
}
