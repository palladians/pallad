import { cva } from '../../../styled-system/css'

export const headingStyle = cva({
  base: {
    fontWeight: 'semibold',
    fontSize: '2xl',
    color: 'gray.50'
  },
  variants: {
    size: {
      lg: {
        fontSize: 'xl'
      },
      md: {
        fontSize: 'lg'
      }
    }
  }
})
