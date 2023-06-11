import { StoryDefault } from '@ladle/react'
import React from 'react'

import { iconX } from '../../assets/icons'
import { Image } from '../Image'
import { IconButton } from '.'

export const Basic = () => (
  <IconButton icon={<Image source={iconX} css={{ width: 16, height: 16 }} />} />
)

export default {
  title: 'IconButton'
} satisfies StoryDefault
