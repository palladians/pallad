import { Box, Text } from '@palladxyz/ui'

import { StructurizedTransaction } from '../../common/types'
import { TxIndicator } from './TxIndicator'

interface TxTileProps {
  tx: StructurizedTransaction
}

export const TxTile = ({ tx }: TxTileProps) => {
  console.log(tx)
  return (
    <Box
      key={tx.hash}
      css={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 16
      }}
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
    </Box>
  )
}
