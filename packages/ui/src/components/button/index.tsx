import { styled } from 'stitches-native'
import { Pressable, Text } from 'react-native'
import {
  buttonBase,
  buttonSizeDefault,
  buttonSizeLg,
  buttonSizeSm,
  buttonVariantDefault,
  buttonVariantDestructive,
  buttonVariantGhost,
  buttonVariantLink,
  buttonVariantOutline,
  buttonVariantSecondary
} from './index.css'
import React from 'react'

const StyledButton = styled(Pressable, {
  ...buttonBase,
  variants: {
    variant: {
      default: buttonVariantDefault,
      destructive: buttonVariantDestructive,
      outline: buttonVariantOutline,
      secondary: buttonVariantSecondary,
      ghost: buttonVariantGhost,
      link: buttonVariantLink
    },
    size: {
      default: buttonSizeDefault,
      sm: buttonSizeSm,
      lg: buttonSizeLg
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

const StyledButtonText = styled(Text, {
  variants: {
    variant: {
      default: {
        color: '$primaryForeground'
      },
      destructive: {
        color: '$destructiveForeground'
      },
      outline: {
        '&:hover': {
          color: '$accentForeground'
        }
      },
      secondary: {
        color: '$secondaryForeground'
      },
      ghost: {
        '&:hover': {
          color: '$accentForeground'
        }
      },
      link: {
        color: '$primary'
      }
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type ButtonProps = React.ComponentProps<typeof StyledButton>

export const Button = ({ children, variant, ...props }: ButtonProps) => {
  return (
    <StyledButton variant={variant} {...props}>
      <StyledButtonText variant={variant}>{children as React.ReactNode}</StyledButtonText>
    </StyledButton>
  )
}
Button.displayName = 'Button'
