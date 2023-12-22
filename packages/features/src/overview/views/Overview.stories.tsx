import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { OverviewView } from './overview'

export const View = () => {
  useStoriesWallet()
  return <OverviewView />
}

export default {
  title: 'Dashboard / Overview'
} satisfies StoryDefault
