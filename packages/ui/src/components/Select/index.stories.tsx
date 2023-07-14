import { StoryDefault } from '@ladle/react'
import React from 'react'

import { Select } from './index'

export const Basic = () => (
  <Select placeholder="Pick color">
    <option>red</option>
    <option>blue</option>
    <option>green</option>
  </Select>
)

export default {
  title: 'Select'
} satisfies StoryDefault
