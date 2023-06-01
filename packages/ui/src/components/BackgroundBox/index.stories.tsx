import React from 'react'
import { StoryDefault } from '@ladle/react'
import { BackgroundBox } from './index'
import { Text } from '../Text'

export const Basic = () => (
  <BackgroundBox source="https://loremflickr.com/640/360" css={{ width: 640, height: 360 }}>
    <Text css={{ color: 'red' }}>Text</Text>
  </BackgroundBox>
)

export default {
  title: 'BackgroundBox'
} satisfies StoryDefault
