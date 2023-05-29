import React from 'react'
import { Box } from '.'
import { StoryDefault } from '@ladle/react'

export const Basic = () => (
  <Box css={{ backgroundColor: '$background', border: '1px solid', borderColor: '$destructive', padding: 16 }}>
    Send
  </Box>
)

export default {
  title: 'Box'
} satisfies StoryDefault
