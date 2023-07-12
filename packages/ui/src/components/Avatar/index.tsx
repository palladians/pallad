import easyMeshGradient from 'easy-mesh-gradient'
import React from 'react'

import { Box } from '../Box'

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
  return (
    <Box
      css={{
        width: 48,
        height: 48,
        backgroundImage: meshGradient,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  )
}
