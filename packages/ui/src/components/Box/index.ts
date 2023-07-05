import { ComponentProps } from 'react'
import { Animated } from 'react-native'

import { styled } from '../../lib/styled'
import { boxStyles } from './index.css'

interface ComposeBoxProps {
  baseComponent?: any
  css?: any
}

export const composeBox = ({
  baseComponent = Animated.View,
  css
}: ComposeBoxProps) => styled(baseComponent, { ...boxStyles, ...css })
export const Box = composeBox({})

export type BoxProps = ComponentProps<typeof Box>
