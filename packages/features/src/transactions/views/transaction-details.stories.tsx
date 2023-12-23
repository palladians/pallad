import { StoryDefault } from '@ladle/react'

import { useStoriesWallet } from '../../../.ladle/utils'
import { TransactionDetailsView } from './transaction-details'

export const View = () => {
  useStoriesWallet()
  return <TransactionDetailsView />
}

export default {
  title: 'Dashboard / Transactions / Details'
} satisfies StoryDefault
