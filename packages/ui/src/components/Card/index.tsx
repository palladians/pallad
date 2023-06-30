import { theme } from '../../lib/styled'
import { Box, composeBox } from '../Box'

export const composeCard = ({ baseComponent }: { baseComponent: any }) =>
  composeBox({
    baseComponent,
    css: { border: `1px ${theme.colors.gray700.value} solid`, borderRadius: 8 }
  })

export const Card = composeCard({ baseComponent: Box })
