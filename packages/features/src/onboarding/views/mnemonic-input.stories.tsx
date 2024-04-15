import { StoryDefault } from '@ladle/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { MnemonicInputData } from '../types'
import { MnemonicInputView } from './mnemonic-input'

export const View = () => {
  const [safetyConfirmed, onSafetyConfirmed] = useState(false)
  const form = useForm<MnemonicInputData>()
  return (
    <MnemonicInputView
      form={form}
      mnemonicValid={true}
      safetyConfirmed={safetyConfirmed}
      onSafetyConfirmed={onSafetyConfirmed}
      onSubmit={(data) => console.log(data)}
      restoring={false}
    />
  )
}

export default {
  title: 'Onboarding / Mnemonic Input'
} satisfies StoryDefault
