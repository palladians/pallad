import { Box, Heading, Spinner, Text } from '@palladxyz/ui'
import { useNavigate, useParams } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useTransaction } from '../../common/lib/hooks'
import { useVaultStore } from '../../common/store/vault'
import { TxIndicator } from '../components/TxIndicator'
import { structurizeTransaction } from '../utils/structurizeTransactions'

export const TransactionDetailsView = () => {
  const navigate = useNavigate()
  const { hash } = useParams()
  const walletPublicKey = useVaultStore(
    (state) => state.getCurrentWallet()?.walletPublicKey
  ) as string
  if (!hash) return null
  const { data: transactionData, isLoading: transactionLoading } =
    useTransaction({ hash })
  const transaction =
    transactionData?.result.data &&
    structurizeTransaction({
      tx: transactionData?.result.data,
      walletPublicKey
    })
  return (
    <AppLayout>
      <Box css={{ padding: '$md', flex: 1, gap: 20 }}>
        <ViewHeading
          title="Transaction Details"
          backButton={{ onPress: () => navigate(-1) }}
        />
        {transactionLoading ? (
          <Spinner />
        ) : (
          <Box css={{ gap: 20 }}>
            {transaction && (
              <Box
                css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
              >
                <TxIndicator side={transaction.side} kind={transaction.kind} />
                <Heading size="md">Incoming</Heading>
              </Box>
            )}
            {transaction && (
              <Box css={{ gap: 8 }}>
                <FormLabel>Hash</FormLabel>
                <Text>{transaction.hash}</Text>
              </Box>
            )}
            {transaction && (
              <Box css={{ gap: 8 }}>
                <FormLabel>Date</FormLabel>
                <Text>{transaction.dateTime}</Text>
              </Box>
            )}
            {transaction && (
              <Box css={{ gap: 8 }}>
                <FormLabel>Amount</FormLabel>
                <Text>{transaction.minaAmount} MINA</Text>
              </Box>
            )}
            {transaction && (
              <Box css={{ gap: 8 }}>
                <FormLabel>Sender</FormLabel>
                <Text>{transaction.from}</Text>
              </Box>
            )}
            {transaction && (
              <Box css={{ gap: 8 }}>
                <FormLabel>Receiver</FormLabel>
                <Text>{transaction.to}</Text>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </AppLayout>
  )
}
