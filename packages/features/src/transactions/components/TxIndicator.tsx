import { Box, Icons, theme } from '@palladxyz/ui'

import { TxKind, TxSide } from '../../common/types'

interface TxSideIndicatorProps {
  side: TxSide
  kind: TxKind
}

export const TxIndicator = ({ kind, side }: TxSideIndicatorProps) => {
  return (
    <Box
      css={{
        borderRadius: '50%',
        backgroundColor: theme.colors.primary800.value,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {kind === TxKind.PAYMENT ? (
        side === TxSide.INCOMING ? (
          <Icons.ArrowDownLeft color={theme.colors.primary500.value} />
        ) : (
          <Icons.ArrowUpRight color={theme.colors.primary500.value} />
        )
      ) : (
        <Icons.Coins color={theme.colors.primary500.value} />
      )}
    </Box>
  )
}
