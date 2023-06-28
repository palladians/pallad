import { Box, Button, Input, RadioGroup, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'

export const SendView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16, flex: 1 }}>
        <ViewHeading
          title="Send"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box>
          <FormLabel
            button={{
              label: 'Address Book',
              onPress: () => console.log('Address Book')
            }}
          >
            Receiver
          </FormLabel>
          <Input placeholder="Receiver Address" autoFocus />
        </Box>
        <Box>
          <FormLabel
            button={{
              label: 'Max Amount',
              onPress: () => console.log('Max Amount')
            }}
          >
            Amount
          </FormLabel>
          <Input placeholder="Transaction Amount" />
        </Box>
        <Box css={{ gap: 4 }}>
          <Text>Memo</Text>
          <Input placeholder="Memo" />
        </Box>
        <Box css={{ gap: 8, flex: 1 }}>
          <Text>Fee</Text>
          <RadioGroup
            options={[
              { value: 'slow', label: 'Slow' },
              { value: 'default', label: 'Default', defaultSelected: true },
              { value: 'fast', label: 'Fast' }
            ]}
            onChange={(value: string) => console.log(value)}
          />
        </Box>
        <Button>Next</Button>
      </Box>
    </AppLayout>
  )
}
