import easyMeshGradient from 'easy-mesh-gradient'
import React from 'react'
import { MeshGradientRenderer } from '@johnn-e/react-mesh-gradient'

import { styled } from '../../../styled-system/jsx'

const StyledMeshGradientRenderer = styled(MeshGradientRenderer)

interface AvatarProps {
  label: string
}

export const Avatar = ({ label }: AvatarProps) => {
  const meshGradient = easyMeshGradient({
    seed: label,
    lightnessRange: [0, 0.75],
    hueRange: [180, 240],
    pointCount: 3
  })
  console.log('>>>MG', meshGradient)
  return (
    <StyledMeshGradientRenderer
      width={16}
      height={16}
      colors={['#C3E4FF', '#6EC3F4', '#EAE2FF', '#B9BEFF', '#B3B8F9']}
      borderRadius="50%"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    />
  )
}
