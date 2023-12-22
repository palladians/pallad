import {
  MinaPayload,
  MinaSpecificArgs,
  Network,
  validateMnemonic,
  wordlist
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { KeyAgents, useVault } from '@palladxyz/vault'
import { Loader2Icon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '@/common/store/app'
import { useOnboardingStore } from '@/common/store/onboarding'
import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ViewHeading } from '@/components/view-heading'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

export const MnemonicInputView = () => {
  const [restoring, setRestoring] = useState(false)
  const restoreWallet = useVault((state) => state.restoreWallet)
  const navigate = useNavigate()
  const { walletName, spendingPassword } = useOnboardingStore(
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
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      mnemonic: ''
    }
  })
  const mnemonic = watch('mnemonic')
  const mnemonicValid = useMemo(
    () => validateMnemonic(mnemonic, wordlist),
    [mnemonic]
  )
  const onSubmit = async ({ mnemonic }: { mnemonic: string }) => {
    if (!walletName) return
    if (!spendingPassword) return
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
          variant="secondary"
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
        <ViewHeading
          title="Type In Your Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        {noOneIsLooking ? (
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Label htmlFor="mnemonicTextarea">Your Mnemonic</Label>
            <Textarea
              id="mnemonicTextarea"
              data-testid="onboarding__yourMnemonicTextarea"
              {...register('mnemonic')}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2 p-4">
            <Label htmlFor="confirmAlone">Confirm No One Is Behind You</Label>
            <Button
              id="confirmAlone"
              onClick={() => setNoOneIsLooking(true)}
              data-testid="onboarding__confirmAlone"
            >
              I am alone
            </Button>
          </div>
        )}
      </div>
    </WizardLayout>
  )
}
