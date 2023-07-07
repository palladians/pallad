import { Box, Card, Text } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useViewAnimation } from '../../common/lib/animation'
import { formatCompact } from '../../common/lib/numbers'
import { EpochProgressChart } from '../components/EpochProgressChart'

export const StakingOverviewView = () => {
  const navigate = useNavigate()
  const { shift, opacity, scale } = useViewAnimation()
  return (
    <AppLayout>
      <Box
        css={{
          padding: '$md',
          gap: 24
        }}
        style={{ opacity, marginTop: shift, transform: [{ scale }] }}
      >
        <ViewHeading
          title="Staking"
          button={{
            label: 'Change Pool',
            onPress: () => navigate('/staking/delegate')
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
            <Text>{formatCompact({ value: 208000 })} MINA</Text>
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
