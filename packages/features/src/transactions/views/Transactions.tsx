import { Box, Spinner } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useTransactions } from '../../common/lib/hooks'
import { TransactionsList } from '../components/TransactionsList'

export const TransactionsView = () => {
  const navigate = useNavigate()
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions()
  const transactions = transactionsData?.result?.data
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16 }}>
        <ViewHeading
          title="Transactions"
          button={{ label: 'Send', onPress: () => navigate('/send') }}
        />
        {transactionsLoading ? (
          <Spinner />
        ) : (
          transactions && <TransactionsList transactions={transactions} />
        )}
      </Box>
    </AppLayout>
  )
}
