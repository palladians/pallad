import { StoryDefault } from '@ladle/react'
import React from 'react'

import { iconX } from '../../assets/icons'
import { Image } from '.'

export const Basic = () => (
  <Image source={iconX} css={{ width: 24, height: 24 }} />
)

export default {
  title: 'Image'
} satisfies StoryDefault
