import { CSS } from '../../lib/styled'
import { boxStyles } from '../Box/index.css'

export const baseHeading: CSS = {
  ...boxStyles,
  fontWeight: '$semibold',
  fontSize: '$2xl',
  color: '$heading',
  variants: {
    size: {
      lg: {
        fontSize: '$xl'
      },
      md: {
        fontSize: '$lg'
      }
    }
  }
}
