import { Icons, theme } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'
import { TransactionResult } from '../components/TransactionResult'

export const TransactionErrorView = () => {
  return (
    <AppLayout>
      <TransactionResult
        title="Submission Error"
        result={{
          icon: Icons.AlertOctagon,
          iconColor: theme.colors.red500.value,
          label: 'Transaction Failed',
          content: 'Error: 500 Broadcast API not reachable'
        }}
        button={{
          label: 'Try Again',
          onPress: () => console.log('details')
        }}
      />
    </AppLayout>
  )
}
