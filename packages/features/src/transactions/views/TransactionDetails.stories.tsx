import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { TransactionDetailsView } from './TransactionDetails'

export const View = () => {
  useStoriesWallet()
  return <TransactionDetailsView />
}

export default {
  title: 'Dashboard / TransactionDetails'
} satisfies StoryDefault
