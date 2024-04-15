import {
  MinaPayload,
  MinaSpecificArgs,
  Network,
  validateMnemonic,
  wordlist
} from '@palladxyz/key-management'
import { getSessionPersistence } from '@palladxyz/persistence'
import { DEFAULT_NETWORK, KeyAgents, useVault } from '@palladxyz/vault'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMixpanel } from 'react-mixpanel-browser'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '@/common/store/app'
import { useOnboardingStore } from '@/common/store/onboarding'

import { MnemonicInputData } from '../types'
import { MnemonicInputView } from '../views/mnemonic-input'

export const MnemonicInputRoute = () => {
  const mixpanel = useMixpanel()
  const [restoring, setRestoring] = useState(false)
  const restoreWallet = useVault((state) => state.restoreWallet)
  const navigate = useNavigate()
  const { walletName, spendingPassword } = useOnboardingStore(
    // TODO: fix this useOnboardingStore it is deprecated
    (state) => ({
      spendingPassword: state.spendingPassword,
      walletName: state.walletName
    }),
    shallow
  )
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized
  )
  const [safetyConfirmed, onSafetyConfirmed] = useState(false)
  const mnemonicInputForm = useForm<MnemonicInputData>()
  const mnemonic = mnemonicInputForm.watch('mnemonic')
  const mnemonicValid = validateMnemonic(mnemonic?.join(' '), wordlist)
  const onSubmit: SubmitHandler<MnemonicInputData> = async (data) => {
    if (!walletName) return
    if (!spendingPassword) return
    getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await useVault.persist.rehydrate()
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet' // TODO: make this configurable if the user restores to mainnet it needs to be 'mainnet
    }
    try {
      setRestoring(true)
      await restoreWallet(
        new MinaPayload(),
        restoreArgs,
        DEFAULT_NETWORK,
        {
          mnemonicWords: data.mnemonic,
          getPassphrase: () =>
            new Promise<Uint8Array>((resolve) =>
              resolve(Buffer.from(spendingPassword))
            )
        },
        walletName,
        KeyAgents.InMemory,
        'Test' // TODO: make this a configurable credential name or random if not provided
      )
      mixpanel.track('WalletRestored')
      setVaultStateInitialized()
      return navigate('/onboarding/finish')
    } finally {
      setRestoring(false)
    }
  }
  return (
    <MnemonicInputView
      form={mnemonicInputForm}
      onSubmit={onSubmit}
      mnemonicValid={mnemonicValid}
      safetyConfirmed={safetyConfirmed}
      onSafetyConfirmed={onSafetyConfirmed}
      restoring={restoring}
    />
  )
}
