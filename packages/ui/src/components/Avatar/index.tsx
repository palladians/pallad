import easyMeshGradient from 'easy-mesh-gradient'
import React from 'react'

import { Box } from '../Box'
import { Text } from '../Text'

interface AvatarProps {
  label: string
}

export const Avatar = ({ label }: AvatarProps) => {
  const letter = label[0]
  const meshGradient = easyMeshGradient({
    seed: label,
    lightnessRange: [0, 0.75],
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
    >
      <Text css={{ fontSize: 20, fontWeight: '$semibold' }}>{letter}</Text>
    </Box>
  )
}
