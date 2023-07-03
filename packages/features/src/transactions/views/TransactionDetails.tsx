import { Box, Heading, Spinner, Text } from '@palladxyz/ui'
import { useNavigate, useParams } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
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
  const transactionMetaFields = transaction && [
    { label: 'Hash', value: transaction.hash },
    { label: 'Amount', value: `${transaction.minaAmount} MINA` },
    { label: 'Sender', value: transaction.from },
    { label: 'Receiver', value: transaction.to }
  ]
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
                <Box css={{ gap: 4 }}>
                  <Text css={{ fontSize: 14 }}>{transaction.dateTime}</Text>
                  <Heading size="md">Incoming</Heading>
                </Box>
              </Box>
            )}
            {transactionMetaFields?.map(({ label, value }) => (
              <MetaField key={label} label={label} value={value} />
            ))}
          </Box>
        )}
      </Box>
    </AppLayout>
  )
}
