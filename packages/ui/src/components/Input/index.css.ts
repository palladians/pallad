import { CSS, theme } from '../../lib/styled'

export const inputBase: CSS = {
  height: '2.5rem',
  width: '100%',
  color: '$body',
  backgroundColor: '$gray900',
  borderColor: '$border',
  borderRadius: '0.375rem',
  border: `1px ${theme.colors.gray500.value} solid`,
  background: 'transparent',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  fontSize: '0.875rem',
  outline: 'none',
  '&::placeholder': {
    color: '$gray500'
  },
  '&:focus': {
    display: 'none'
  },
  // boxShadow: 'var(--ring-offset-background) 0px 0px 0px 2px',
  // '&:focus-visible': {
  //   boxShadow: 'var(--ring-offset-background) 0px 0px 0px 2px, var(--ring) 0px 0px 0px 2px'
  // },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: '0.5'
  }
}
