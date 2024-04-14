import { StoryDefault } from '@ladle/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { UnlockWalletView } from './unlock-wallet'

export const View = () => {
  const [restartAlertVisible, setRestartAlertVisible] = useState(false)
  const form = useForm<UnlockWalletData>()
  return (
    <UnlockWalletView
      form={form}
      onSubmit={() => console.log('submit')}
      restartAlertVisible={restartAlertVisible}
      setRestartAlertVisible={setRestartAlertVisible}
      showPassword={false}
      togglePassword={() => console.log('toggle')}
    />
  )
}

export default {
  title: 'Dashboard / Unlock Wallet'
} satisfies StoryDefault
