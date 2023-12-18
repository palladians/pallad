import { ClockIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import colors from 'tailwindcss/colors' // eslint-disable-line

import { AppLayout } from '../../common/components/AppLayout'
import { TransactionResult } from '../components/TransactionResult'

export const TransactionSuccessView = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  return (
    <AppLayout>
      <TransactionResult
        title="Submitted successfully"
        result={{
          icon: ClockIcon,
          iconColor: colors.sky['500'],
          label: 'Pending Transaction Hash',
          content: state.hash
        }}
        button={{
          label: 'View Transactions',
          onClick: () => navigate(`/transactions`)
        }}
      />
    </AppLayout>
  )
}
