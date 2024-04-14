import { StoryDefault } from '@ladle/react'
import { useState } from 'react'

import { MnemonicWritedownView } from './mnemonic-writedown'

const TEST_MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const View = () => {
  const [safetyConfirmed, setSafetyConfirmed] = useState(false)
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  return (
    <MnemonicWritedownView
      mnemonicWords={TEST_MNEMONIC.split(' ')}
      mnemonicWritten={mnemonicWritten}
      setMnemonicWritten={setMnemonicWritten}
      safetyConfirmed={safetyConfirmed}
      onSafetyConfirmed={setSafetyConfirmed}
      onConfirm={() => console.log('confirmed')}
    />
  )
}

export default {
  title: 'Onboarding / Mnemonic Writedown'
} satisfies StoryDefault
