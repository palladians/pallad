import React from 'react'
import { Pressable, Text } from 'react-native'

import { styled } from '../../lib/styled'
import { composeBox } from '../Box'
import { Image } from '../Image'
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

const StyledPressable = composeBox({ baseComponent: Pressable })

const StyledButton = styled(StyledPressable, {
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
  fontWeight: '600',
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

type ButtonProps = React.ComponentProps<typeof StyledButton> & {
  textCss?: any
  leftIcon?: React.ReactNode
}

export const Button = React.forwardRef(
  ({ children, variant, textCss, leftIcon, ...props }: ButtonProps, ref) => {
    return (
      <StyledButton as={Pressable} variant={variant} ref={ref} {...props}>
        {leftIcon && (
          <Image source={leftIcon} css={{ width: 24, height: 24 }} />
        )}
        <StyledButtonText variant={variant} css={textCss}>
          {children as React.ReactNode}
        </StyledButtonText>
      </StyledButton>
    )
  }
)
Button.displayName = 'Button'
