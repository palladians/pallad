import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { ReceiveView } from './Receive'

export const View = () => {
  useStoriesWallet()
  return <ReceiveView />
}

export default {
  title: 'Dashboard / Receive'
} satisfies StoryDefault
