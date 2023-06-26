import { Box, Button, Heading, Input, RadioGroup, Text } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'

export const SendView = () => {
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16, flex: 1 }}>
        <Heading size="lg">Send</Heading>
        <Box css={{ gap: 8 }}>
          <Text>Receiver</Text>
          <Input placeholder="Receiver Address" autoFocus />
        </Box>
        <Box css={{ gap: 8 }}>
          <Text>Amount</Text>
          <Input placeholder="Transaction Amount" />
        </Box>
        <Box css={{ gap: 8 }}>
          <Text>Memo</Text>
          <Input placeholder="Memo" />
        </Box>
        <Box css={{ gap: 8 }}>
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
        <Box css={{ flex: 1 }}>
          <Button>Next</Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
