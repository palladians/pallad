import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { TransactionsView } from './transactions'

export const View = () => {
  useStoriesWallet()
  return <TransactionsView />
}

export default {
  title: 'Dashboard / Transactions / List'
} satisfies StoryDefault
