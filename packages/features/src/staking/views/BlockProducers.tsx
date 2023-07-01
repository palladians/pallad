import { Box, Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { BlockProducerTile } from '../components/BlockProducerTile'

const MOCKED_PRODUCERS = [
  { name: 'Pallad', stake: 24000, delegatorsCount: 6000 },
  { name: 'Pallad 2', stake: 12000, delegatorsCount: 3000 }
]

export const BlockProducersView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <Box css={{ padding: '$md', gap: 16 }}>
        <ViewHeading
          title="Find Producers"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 12 }}>
          {MOCKED_PRODUCERS.map((producer, i) => (
            <BlockProducerTile key={i} producer={producer} />
          ))}
          <Button variant="link">Add Your Pool</Button>
        </Box>
      </Box>
    </AppLayout>
  )
}
