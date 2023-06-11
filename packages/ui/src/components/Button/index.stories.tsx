import { StoryDefault } from '@ladle/react'
import React from 'react'

import { Button } from '.'

export const Basic = () => <Button>Send</Button>
export const Destructive = () => <Button variant="destructive">Delete</Button>
export const Secondary = () => <Button variant="secondary">Send</Button>
export const Outline = () => <Button variant="outline">Send</Button>
export const Ghost = () => <Button variant="ghost">Send</Button>
export const Link = () => <Button variant="link">Send</Button>

export default {
  title: 'Button'
} satisfies StoryDefault
