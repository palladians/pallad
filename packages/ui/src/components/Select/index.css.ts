import { CSS } from '../../lib/styled'

export const selectTriggerBase: CSS = {
  display: 'flex',
  height: '2.5rem',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '0.375rem',
  border: '1px solid',
  borderColor: '$inputBorder',
  background: 'transparent',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  fontSize: '0.875rem',
  outline: 'none',
  // boxShadow: 'var(--ring-offset-background) 0px 0px 0px 2px',
  '&::placeholder': {
    color: '$mutedForeground'
  },
  '&:focus': {
    outline: 'none'
    // boxShadow: 'var(--ring-offset-background) 0px 0px 0px 2px, var(--ring) 0px 0px 0px 2px'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: '0.5'
  }
}

export const selectContentBase: CSS = {
  top: 4,
  padding: 8,
  minWidth: 256,
  width: '100%',
  overflow: 'hidden',
  borderRadius: '4px',
  border: '1px solid',
  borderColor: '$popoverBorder',
  background: '$popover',
  color: '$popoverForeground',
  gap: 4
  // boxShadow: '0 0 16px #000000'
}
