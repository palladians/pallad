import { Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { BlockProducerTile } from '../components/BlockProducerTile'

const MOCKED_PRODUCERS = [
  {
    name: 'Pallad',
    publicKey: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS',
    stake: 24000,
    delegatorsCount: 6000
  },
  {
    name: 'Pallad 2',
    publicKey: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS',
    stake: 12000,
    delegatorsCount: 3000
  }
]

export const BlockProducersView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="p-4 gap-4">
        <ViewHeading
          title="Find Producers"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="gap-3">
          {MOCKED_PRODUCERS.map((producer, i) => (
            <BlockProducerTile key={i} producer={producer} />
          ))}
          <Button variant="link">Add Your Pool</Button>
        </div>
      </div>
    </AppLayout>
  )
}
