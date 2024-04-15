import { StoryDefault } from '@ladle/react'

import { RestoreWalletView } from './restore-wallet'

export const View = () => (
  <RestoreWalletView onSubmit={(data) => console.log(data)} />
)

export default {
  title: 'Onboarding / Restore Wallet'
} satisfies StoryDefault
