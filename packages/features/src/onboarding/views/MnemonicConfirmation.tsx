import { Button, cn, Input, Label } from '@palladxyz/ui'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'
import { useOnboardingStore } from '../../wallet/store/onboarding'

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationView = () => {
  const { wallet } = useWallet()
  console.log(wallet)
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized
  )
  const navigate = useNavigate()
  const mnemonic = useOnboardingStore((state) => state.mnemonic)
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
    await setVaultStateInitialized()
    return navigate('/onboarding/finish')
  }
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onClick={() => navigate(-1)}
            className="flex-1"
            data-testid="onboarding__backButton"
          >
            Back
          </Button>
          <Button
            variant="secondary"
            className={cn([
              'flex-1 opacity-50 transition-opacity',
              isValid && 'opavity-100'
            ])}
            disabled={!isValid}
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
          title="Confirm The Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="gap-8">
          <Label data-testid="onboarding__writedownIndex">
            Type in the word #{confirmationIndex + 1}
          </Label>
          <Input
            data-testid="onboarding__mnemonicConfirmationInput"
            {...register('mnemonicWord')}
          />
        </div>
      </div>
    </WizardLayout>
  )
}
