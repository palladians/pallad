import {
  MinaPayload,
  MinaSpecificArgs,
  Network,
  validateMnemonic,
  wordlist
} from '@palladxyz/key-management'
import { getSessionPersistence } from '@palladxyz/persistence'
import { DEFAULT_NETWORK, KeyAgents, useVault } from '@palladxyz/vault'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMixpanel } from 'react-mixpanel-browser'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '@/common/store/app'
import { useOnboardingStore } from '@/common/store/onboarding'
import { Autocomplete } from '@/components/autocomplete'
import { ButtonArrow } from '@/components/button-arrow'
import { SecurityCheck } from '@/components/security-check'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

type MnemonicInputForm = {
  mnemonic: string[]
}

const MNEMONIC_LENGTH = 12
const mnemonicIterator = Array.from(
  { length: MNEMONIC_LENGTH },
  (_, i) => i + 1
)

export const MnemonicInputView = () => {
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
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const { register, handleSubmit, watch, setValue } =
    useForm<MnemonicInputForm>()
  const mnemonic = watch('mnemonic')
  const mnemonicValid = validateMnemonic(mnemonic?.join(' '), wordlist)
  const onSubmit: SubmitHandler<MnemonicInputForm> = async (data) => {
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
    <WizardLayout
      title="Restore from Mnemonic"
      backButtonPath={-1}
      footer={
        <Button
          className={cn([
            'flex-1 transition-opacity opacity-50 gap-2 group',
            mnemonicValid && 'opacity-100'
          ])}
          disabled={!mnemonicValid || restoring}
          onClick={handleSubmit(onSubmit)}
          data-testid="onboarding__nextButton"
        >
          {restoring && <Loader2Icon size={16} className="animate-spin" />}
          <span>Next</span>
          <ButtonArrow />
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-4">
        {noOneIsLooking ? (
          <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-1 flex-col gap-4 p-4">
            <Label htmlFor="mnemonicTextarea">Mnemonic</Label>
            <div className="grid grid-cols-3 gap-2">
              {mnemonicIterator.map((wordLabel, i) => (
                <Autocomplete
                  placeholder={wordLabel.toString()}
                  options={wordlist}
                  setValue={(value) => setValue(`mnemonic.${i}`, value)}
                  autoFocus={i === 0}
                  onEnterPressed={() => {
                    if (i === mnemonicIterator.length - 1) return
                    const nextElement = document.querySelector(
                      `[name="mnemonic.${i + 1}"]`
                    )
                    if (!nextElement) return
                    return (nextElement as HTMLElement).focus()
                  }}
                  onPaste={(event) => {
                    if (i !== 0) return
                    const value = event.clipboardData.getData('Text')
                    event.currentTarget.blur()
                    const mnemonic = value.split(' ')
                    if (mnemonic.length !== 12) return
                    mnemonic.forEach((word, i) => {
                      setValue(`mnemonic.${i}`, word)
                    })
                  }}
                  data-testid={`onboarding__mnemonicField.${i}`}
                  {...register(`mnemonic.${i}`)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2 p-4">
            <SecurityCheck onConfirm={() => setNoOneIsLooking(true)} />
          </div>
        )}
      </div>
    </WizardLayout>
  )
}
