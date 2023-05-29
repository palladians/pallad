import React from 'react'
import { Image as BaseImage } from 'react-native'
import { styled } from '../../lib/styled'

const StyledImage = styled(BaseImage)

export const Image = (props: React.ComponentProps<typeof StyledImage>) => {
  return <StyledImage {...props} />
}
