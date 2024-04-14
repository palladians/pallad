import { ClockIcon } from 'lucide-react'
import colors from 'tailwindcss/colors' // eslint-disable-line

import { AppLayout } from '@/components/app-layout'

import { TransactionResult } from '../components/transaction-result'

type TransactionSuccessViewProps = {
  hash: string
  onGoToTransactions: () => void
}

export const TransactionSuccessView = ({
  hash,
  onGoToTransactions
}: TransactionSuccessViewProps) => {
  return (
    <AppLayout>
      <TransactionResult
        title="Submitted successfully"
        result={{
          icon: ClockIcon,
          iconColor: colors.sky['500'],
          label: 'Pending Transaction Hash',
          content: hash
        }}
        button={{
          label: 'View Transactions',
          onClick: onGoToTransactions
        }}
      />
    </AppLayout>
  )
}
