import {
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { KeyAgents, useVault } from '@palladxyz/vault'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAppStore } from '../../common/store/app'
import { useOnboardingStore } from '../../common/store/onboarding'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
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
        Mina.Networks.BERKELEY,
        {
          mnemonicWords: mnemonic.split(' '),
          getPassphrase: async () => Buffer.from(spendingPassword)
        },
        walletName,
        KeyAgents.InMemory,
        'Test'
      )
      setVaultStateInitialized()
      return navigate('/onboarding/finish')
    } finally {
      setRestoring(false)
    }
  }
  return (
    <WizardLayout
      footer={
        <Button
          type="submit"
          form="mnemonicConfirmationForm"
          variant="secondary"
          className={cn([
            'flex-1 opacity-50 transition-opacity gap-2',
            isValid && 'opacity-100'
          ])}
          disabled={!isValid || restoring}
          data-testid="onboarding__nextButton"
        >
          {restoring && <Loader2Icon size={16} className="animate-spin" />}
          <span>Next</span>
        </Button>
      }
    >
      <form
        className="flex flex-col flex-1 gap-6"
        id="mnemonicConfirmationForm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <ViewHeading
          title="Confirm The Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <Label data-testid="onboarding__writedownIndex">
            Type in the word #{confirmationIndex + 1}
          </Label>
          <Input
            data-testid="onboarding__mnemonicConfirmationInput"
            {...register('mnemonicWord')}
            autoFocus
          />
        </div>
      </form>
    </WizardLayout>
  )
}
