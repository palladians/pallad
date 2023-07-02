import { Avatar, Box, composeCard, Text } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { formatCompact } from '../../common/lib/numbers'

const Card = composeCard({ baseComponent: Pressable })

type BlockProducer = {
  name: string
  publicKey: string
  stake: number
  delegatorsCount: number
}

interface BlockProducerTileProps {
  producer: BlockProducer
}

export const BlockProducerTile = ({ producer }: BlockProducerTileProps) => {
  const navigate = useNavigate()
  return (
    <Card
      css={{
        flexDirection: 'row',
        padding: '$sm',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      onPress={() =>
        navigate('/staking/delegate', {
          state: { address: producer.publicKey }
        })
      }
    >
      <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar label={producer.name} />
        <Text css={{ fontWeight: '$semibold' }}>{producer.name}</Text>
      </Box>
      <Box css={{ gap: 4 }}>
        <Text css={{ textAlign: 'right', fontWeight: '$semibold' }}>
          {formatCompact({ value: producer.stake })} MINA
        </Text>
        <Text css={{ textAlign: 'right', fontSize: 14 }}>
          {formatCompact({ value: producer.delegatorsCount })} Delegators
        </Text>
      </Box>
    </Card>
  )
}
