import React from 'react'
import { IconButton } from '.'
import { Image } from '../Image'
import { StoryDefault } from '@ladle/react'
import { iconX } from '../../assets/icons'

export const Basic = () => <IconButton icon={<Image source={iconX} css={{ width: 16, height: 16 }} />} />

export default {
  title: 'IconButton'
} satisfies StoryDefault
