import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOnboardingStore } from '@/common/store/onboarding'

import { MnemonicWritedownView } from '../views/mnemonic-writedown'

export const MnemonicWritedownRoute = () => {
  const navigate = useNavigate()
  const mnemonicWords = useOnboardingStore(
    (state) => state.mnemonic?.split(' ')
  )
  const [safetyConfirmed, setSafetyConfirmed] = useState(false)
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  return (
    <MnemonicWritedownView
      mnemonicWords={mnemonicWords ?? []}
      mnemonicWritten={mnemonicWritten}
      setMnemonicWritten={setMnemonicWritten}
      safetyConfirmed={safetyConfirmed}
      onSafetyConfirmed={setSafetyConfirmed}
      onConfirm={() => navigate('/onboarding/confirmation')}
    />
  )
}
