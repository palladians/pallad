import { StoryDefault } from '@ladle/react'
import React from 'react'

import { Text } from '../Text'
import { Box } from '.'

export const Basic = () => (
  <Box
    css={{
      backgroundColor: '$background',
      border: '1px solid',
      borderColor: '$destructive',
      padding: 16
    }}
  >
    <Text>Example Box</Text>
  </Box>
)

export default {
  title: 'Box'
} satisfies StoryDefault
