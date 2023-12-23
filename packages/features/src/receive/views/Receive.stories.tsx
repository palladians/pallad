import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { ReceiveView } from './receive'

export const View = () => {
  useStoriesWallet()
  return <ReceiveView />
}

export default {
  title: 'Dashboard / Receive'
} satisfies StoryDefault
