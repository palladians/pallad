import { Box, Card, Text } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { EpochProgressChart } from '../components/EpochProgressChart'

export const StakingOverviewView = () => {
  return (
    <AppLayout>
      <Box
        css={{
          padding: '$md',
          gap: 24
        }}
      >
        <ViewHeading
          title="Staking"
          button={{
            label: 'Change Pool',
            onPress: () => console.log('change pool')
          }}
        />
        <Card
          css={{
            padding: '$md',
            gap: 16
          }}
        >
          <Box css={{ flexDirection: 'row', gap: 8 }}>
            <Box css={{ flex: 1, gap: 8 }}>
              <FormLabel>Epoch</FormLabel>
              <Text>55</Text>
            </Box>
            <Box css={{ flex: 1, gap: 8 }}>
              <FormLabel>Slot</FormLabel>
              <Text>6894/7140</Text>
            </Box>
          </Box>
          <Box css={{ flexDirection: 'row', gap: 8 }}>
            <Box css={{ flex: 1, gap: 8 }}>
              <FormLabel>Epoch ends in</FormLabel>
              <Text>01d : 3h : 7m</Text>
            </Box>
            <Box css={{ flex: 1, gap: 8 }}>
              <EpochProgressChart progress={0.75} />
            </Box>
          </Box>
        </Card>
        <ViewHeading title="Delegation Info" />
        <Box css={{ gap: 24 }}>
          <Box css={{ gap: 8 }}>
            <FormLabel>Block Producer</FormLabel>
            <Text>B62qm...iQvm</Text>
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>Total Stake</FormLabel>
            <Text>208k MINA</Text>
          </Box>
          <Box css={{ gap: 8 }}>
            <FormLabel>Total Delegators</FormLabel>
            <Text>56</Text>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
