import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'

export const TransactionsView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="p-4 gap-4">
        <ViewHeading
          title="Transactions"
          button={{ label: 'Send', onClick: () => navigate('/send') }}
        />
      </div>
    </AppLayout>
  )
}
