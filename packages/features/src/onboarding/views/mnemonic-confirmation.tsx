import {
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { getSessionPersistence } from '@palladxyz/persistence'
import { DEFAULT_NETWORK, KeyAgents, useVault } from '@palladxyz/vault'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useAnalytics } from '@/common/hooks/use-analytics'
import { useAppStore } from '@/common/store/app'
import { useOnboardingStore } from '@/common/store/onboarding'
import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const { track } = useAnalytics()
  const [restoring, setRestoring] = useState(false)
  const restoreWallet = useVault((state) => state.restoreWallet)
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized
  )
  const navigate = useNavigate()
  const { spendingPassword, walletName, mnemonic } = useOnboardingStore(
    (state) => ({
      spendingPassword: state.spendingPassword,
      walletName: state.walletName,
      mnemonic: state.mnemonic
    })
  )
  const mnemonicSplit = useMemo(() => mnemonic?.split(' '), [mnemonic])
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      mnemonicWord: ''
    }
  })
  const mnemonicWord = watch('mnemonicWord')
  const isValid = useMemo(
    () => mnemonicSplit?.[confirmationIndex] === mnemonicWord,
    [mnemonicWord, mnemonicSplit, confirmationIndex]
  )
  const onSubmit = async () => {
    if (!walletName) return
    if (!spendingPassword) return
    if (!mnemonic) return
    getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await useVault.persist.rehydrate()
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet' // TODO: make this configurable
    }
    try {
      setRestoring(true)
      await restoreWallet(
        new MinaPayload(),
        restoreArgs,
        DEFAULT_NETWORK,
        {
          mnemonicWords: mnemonic.split(' '),
          getPassphrase: () =>
            new Promise<Uint8Array>((resolve) =>
              resolve(Buffer.from(spendingPassword))
            )
        },
        walletName,
        KeyAgents.InMemory,
        'Test' // TODO: make this a configurable credential name or random if not provided
      )
      track({ event: 'wallet_created' })
      setVaultStateInitialized()
      return navigate('/onboarding/finish')
    } finally {
      setRestoring(false)
    }
  }
  return (
    <WizardLayout
      title="Confirm The Mnemonic"
      backButtonPath={-1}
      footer={
        <Button
          type="submit"
          form="mnemonicConfirmationForm"
          className={cn([
            'flex-1 opacity-50 transition-opacity gap-2 group',
            isValid && 'opacity-100'
          ])}
          disabled={!isValid || restoring}
          data-testid="onboarding__nextButton"
        >
          {restoring && <Loader2Icon size={16} className="animate-spin" />}
          <span>Next</span>
          <ButtonArrow />
        </Button>
      }
    >
      <form
        className="flex flex-col flex-1 gap-4 p-4"
        id="mnemonicConfirmationForm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Label data-testid="onboarding__writedownIndex">
          Type in the word #{confirmationIndex + 1}
        </Label>
        <Input
          data-testid="onboarding__mnemonicConfirmationInput"
          {...register('mnemonicWord')}
          autoFocus
        />
      </form>
    </WizardLayout>
  )
}
