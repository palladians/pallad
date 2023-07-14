import { cva } from '../../../styled-system/css'
import { SystemStyleObject } from '../../../styled-system/types'

export const base: SystemStyleObject = {
  height: '2.5rem',
  width: '100%',
  color: 'gray.50',
  backgroundColor: 'gray.900',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderColor: 'gray.600',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  fontSize: '0.875rem',
  outline: 'none',
  '&::placeholder': {
    color: 'gray500'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: '0.5'
  }
}

export const inputStyle = cva({
  base
})
