import { Icons, theme } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { TransactionResult } from '../components/TransactionResult'

export const TransactionSuccessView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <TransactionResult
        title="Submitted successfully"
        result={{
          icon: Icons.Clock,
          iconColor: theme.colors.primary500.value,
          label: 'Pending Transaction Hash',
          content: 'Ckpa3EsAv91c4btWWbvdKNeddEEkvMxgUM5SzVBr48hNizyLrwxeN'
        }}
        button={{
          label: 'View Details',
          onPress: () =>
            navigate(
              '/transactions/CkpZ1ckw13bPjXpdRE1F186Wu9x9HydRiW3sfgrE2JYHQxauk1sKP'
            )
        }}
      />
    </AppLayout>
  )
}
