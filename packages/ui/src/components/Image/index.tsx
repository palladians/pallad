import React from 'react'
import { Image as BaseImage } from 'react-native'
import { styled } from '../../lib/styled'

const StyledImage = styled(BaseImage)

type StyledImageProps = React.ComponentProps<typeof StyledImage>

interface ImageProps extends StyledImageProps {
  source: any
  css?: StyledImageProps['css']
}

export const Image = (props: ImageProps) => {
  return <StyledImage {...props} />
}
