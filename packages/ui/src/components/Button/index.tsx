import { cva } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'

const buttonStyle = cva({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2rem',
    fontSize: '0.875rem',
    transition:
      'color 0.3s ease-out, background-color 0.3s ease-out, border-color 0.3s ease-out',
    outline: '2px solid transparent',
    outlineOffset: '2px',
    flexDirection: 'row',
    gap: 12,
    color: '$body',
    fontWeight: 'semibold',
    cursor: 'pointer'
  },
  variants: {
    variant: {
      default: {
        color: 'gray.50',
        backgroundColor: 'gray.800',
        '&:hover': {
          backgroundColor: 'gray.700'
        }
      },
      destructive: {
        color: 'red.100',
        backgroundColor: 'red.600',
        '&:hover': {
          backgroundColor: 'red.500',
          opacity: 0.9
        }
      },
      outline: {
        border: '1px solid',
        borderColor: 'gray.500',
        '&:hover': {
          backgroundColor: 'primary.50',
          color: 'primary.600',
          borderColor: 'primary.600'
        }
      },
      secondary: {
        backgroundColor: 'gray.100',
        '&:hover': {
          backgroundColor: 'gray.200',
          opacity: 0.8
        }
      },
      ghost: {
        '&:hover': {
          backgroundColor: 'primary.50'
        }
      },
      link: {
        color: 'primary.600',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    },
    size: {
      default: {
        height: '2.5rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      },
      sm: {
        height: '2.25rem',
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
        borderRadius: '0.375rem'
      },
      lg: {
        height: '2.75rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        borderRadius: '0.375rem'
      }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

export const Button = styled('button', buttonStyle)
