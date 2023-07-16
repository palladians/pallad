import { AlertOctagonIcon } from 'lucide-react'

import { AppLayout } from '../../common/components/AppLayout'
import { TransactionResult } from '../components/TransactionResult'

export const TransactionErrorView = () => {
  return (
    <AppLayout>
      <TransactionResult
        title="Submission Error"
        result={{
          icon: AlertOctagonIcon,
          iconColor: '#ff0000',
          label: 'Transaction Failed',
          content: 'Error: 500 Broadcast API not reachable'
        }}
        button={{
          label: 'Try Again',
          onClick: () => console.log('details')
        }}
      />
    </AppLayout>
  )
}
