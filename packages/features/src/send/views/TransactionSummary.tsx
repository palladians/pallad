import { Box, Button, Card, Icons, Text, theme } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

export const TransactionSummaryView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16, flex: 1 }}>
        <ViewHeading
          title="Transaction Summary"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Card css={{ padding: '$sm', gap: 16, position: 'relative' }}>
          <Box
            css={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translate(0, -50%)'
            }}
          >
            <Icons.ArrowDown color={theme.colors.primary500.value} />
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>From</FormLabel>
            <Text>B62qk...SrTQrS</Text>
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>To</FormLabel>
            <Text>B62qk...SrTQrS</Text>
          </Box>
        </Card>
        <Box css={{ gap: 16, flex: 1 }}>
          <Box css={{ gap: 4 }}>
            <FormLabel>Amount</FormLabel>
            <Text>15 MINA</Text>
          </Box>
          <Box css={{ gap: 4 }}>
            <FormLabel>Fee</FormLabel>
            <Text>0.2 MINA</Text>
          </Box>
          <Box css={{ gap: 4 }}>
            <FormLabel>Total</FormLabel>
            <Text>15.2 MINA</Text>
          </Box>
        </Box>
        <Button onPress={() => navigate('/transactions/success')}>Send</Button>
      </Box>
    </AppLayout>
  )
}
