import { CSS } from '../../lib/styled'
import { inputBase } from '../Input/index.css'

export const selectTriggerBase: CSS = {
  ...inputBase,
  borderRadius: '0.375rem',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  paddingTop: '0.675rem',
  paddingBottom: '0.5rem',
  outline: 'none',
  '&::placeholder': {
    color: '$mutedForeground'
  },
  '&:focus': {
    outline: 'none'
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
  maxWidth: '100vw',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '4px',
  border: '1px solid',
  borderColor: '$border',
  backgroundColor: '$backgroundElevation1',
  color: '$popoverForeground',
  gap: 4
}
