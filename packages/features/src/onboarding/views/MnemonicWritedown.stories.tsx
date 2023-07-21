import { StoryDefault } from '@ladle/react'
import { useEffect } from 'react'

import { useOnboardingStore } from '../../wallet/store/onboarding'
import { MnemonicWritedownView } from './MnemonicWritedown'

export const View = () => {
  const setMnemonic = useOnboardingStore((state) => state.setMnemonic)
  useEffect(() => {
    setMnemonic(
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    )
  }, [])
  return <MnemonicWritedownView />
}

export default {
  title: 'Onboarding / Mnemonic Writedown'
} satisfies StoryDefault
