import { cva } from '../../../styled-system/css'

export const checkboxRootStyle = cva({
  base: {
    backgroundColor: 'white',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { backgroundColor: 'primary.50' },
    '&:focus': { boxShadow: `0 0 0 2px black` }
  }
})

export const checkboxIndicatorStyle = cva({
  base: {
    color: 'primary.500'
  }
})

export const labelCss = cva({
  base: {
    color: 'white',
    fontSize: '16px',
    lineHeight: 1
  }
})
