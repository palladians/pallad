import React from 'react'
import { Image } from '.'
import { StoryDefault } from '@ladle/react'
import { iconX } from '../../assets/icons'

export const Basic = () => <Image source={iconX} css={{ width: 24, height: 24 }} />

export default {
  title: 'Image'
} satisfies StoryDefault
