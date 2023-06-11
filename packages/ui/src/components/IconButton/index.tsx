import React from 'react'
import { Pressable } from 'react-native'

import { styled } from '../../lib/styled'
import { iconButtonBase } from './index.css'

const StyledPressable = styled(Pressable, iconButtonBase)
type StyledPressableProps = React.ComponentProps<typeof StyledPressable>

interface IconButtonProps extends Partial<StyledPressableProps> {
  icon: React.ReactNode
  css?: StyledPressableProps['css']
  onPress?: StyledPressableProps['onPress']
  dataSet?: any
}

export const IconButton = ({ icon, ...rest }: IconButtonProps) => {
  return <StyledPressable {...rest}>{icon}</StyledPressable>
}
