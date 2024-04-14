import { StoryDefault } from '@ladle/react'

import { CreateWalletView } from './create-wallet'

export const View = () => (
  <CreateWalletView onSubmit={(data) => console.log(data)} />
)

export default {
  title: 'Onboarding / Create Wallet'
} satisfies StoryDefault
