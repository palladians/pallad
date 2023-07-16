import { validateMnemonic, wordlist } from '@palladxyz/key-generator'
import { Button, Label, Textarea } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'
import { useOnboardingStore } from '../../wallet/store/onboarding'

export const MnemonicInputView = () => {
  const { wallet } = useWallet()
  console.log(wallet)
  const navigate = useNavigate()
  const walletName = useOnboardingStore((state) => state.walletName)
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
    console.log('>>>MN', mnemonic)
    await setVaultStateInitialized()
    return navigate('/onboarding/finish')
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onClick={() => navigate(-1)}
            css={{ flex: 1, width: 'auto' }}
            data-testid="onboarding__backButton"
          >
            Back
          </Button>
          <Button
            variant="secondary"
            css={{
              flex: 1,
              width: 'auto',
              opacity: mnemonicValid ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }}
            disabled={!mnemonicValid}
            onClick={handleSubmit(onSubmit)}
            data-testid="onboarding__nextButton"
          >
            Next
          </Button>
        </>
      }
    >
      <div className="gap-6">
        <ViewHeading
          title="Type In Your Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        {noOneIsLooking ? (
          <div className="gap-4">
            <Label>Your Mnemonic</Label>
            <Textarea
              css={{
                color: '$white',
                borderColor: '$gray600',
                backgroundColor: '$gray800',
                lineHeight: '175%'
              }}
              data-testid="onboarding__yourMnemonicTextarea"
              {...register('mnemonic')}
            />
          </div>
        ) : (
          <div className="gap-2">
            <FormLabel>Confirm No One Is Behind You</FormLabel>
            <Button
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
