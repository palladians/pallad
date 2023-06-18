import React from 'react'
import { Image as BaseImage } from 'react-native'

import { styled } from '../../lib/styled'

const StyledImage = styled(BaseImage)

type StyledImageProps = React.ComponentProps<typeof StyledImage>

export const Image = (props: StyledImageProps) => {
  return <StyledImage {...props} />
}
