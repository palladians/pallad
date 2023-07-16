import { ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { TransactionResult } from '../components/TransactionResult'

export const TransactionSuccessView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <TransactionResult
        title="Submitted successfully"
        result={{
          icon: ClockIcon,
          iconColor: '#ff00ff',
          label: 'Pending Transaction Hash',
          content: 'Ckpa3EsAv91c4btWWbvdKNeddEEkvMxgUM5SzVBr48hNizyLrwxeN'
        }}
        button={{
          label: 'View Details',
          onClick: () =>
            navigate(
              '/transactions/CkpZ1ckw13bPjXpdRE1F186Wu9x9HydRiW3sfgrE2JYHQxauk1sKP'
            )
        }}
      />
    </AppLayout>
  )
}
