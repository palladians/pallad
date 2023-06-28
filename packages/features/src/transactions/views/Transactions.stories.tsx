import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { TransactionsView } from './Transactions'

export const View = () => {
  useStoriesWallet()
  return <TransactionsView />
}

export default {
  title: 'Dashboard / Transactions'
} satisfies StoryDefault
