import { AlertOctagonIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import colors from 'tailwindcss/colors' // eslint-disable-line

import { AppLayout } from '@/components/app-layout'

import { TransactionResult } from '../components/transaction-result'

export const TransactionErrorView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <TransactionResult
        title="Submission Error"
        result={{
          icon: AlertOctagonIcon,
          iconColor: colors.red['500'],
          label: 'Transaction Failed',
          content: 'Error: 500 Broadcast API not reachable'
        }}
        button={{
          label: 'Try Again',
          onClick: () => navigate(-1)
        }}
      />
    </AppLayout>
  )
}
