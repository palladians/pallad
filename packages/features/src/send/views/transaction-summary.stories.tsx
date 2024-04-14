import { StoryDefault } from '@ladle/react'

import { TransactionSummaryView } from './transaction-summary'

export const View = () => (
  <TransactionSummaryView
    onGoBack={() => console.log('go back')}
    transaction={{
      amount: '25',
      fee: '0.1',
      from: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS',
      to: 'B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS',
      kind: 'transaction',
      total: '25.1'
    }}
  />
)

export default {
  title: 'Dashboard / Send / Summary'
} satisfies StoryDefault
