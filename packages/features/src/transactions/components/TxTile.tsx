import { Box, composeBox, Text } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { StructurizedTransaction } from '../../common/types'
import { TxIndicator } from './TxIndicator'

const StyledPressable = composeBox({ baseComponent: Pressable })

interface TxTileProps {
  tx: StructurizedTransaction
}

export const TxTile = ({ tx }: TxTileProps) => {
  const navigate = useNavigate()
  return (
    <StyledPressable
      key={tx.hash}
      css={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 16
      }}
      onPress={() => navigate(`/transactions/${tx.hash}`)}
    >
      <TxIndicator side={tx.side} kind={tx.kind} />
      <Box css={{ width: 'auto', flex: 1, gap: 8 }}>
        <Text css={{ width: 'auto', flex: 1, fontWeight: '600' }}>
          Received
        </Text>
        <Text css={{ width: 'auto', flex: 1, fontSize: 14 }}>{tx.time}</Text>
      </Box>
      <Box css={{ width: 'auto' }}>
        <Text css={{ width: 'auto', fontWeight: '600' }}>
          {tx.minaAmount} MINA
        </Text>
      </Box>
    </StyledPressable>
  )
}
