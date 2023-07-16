import { Button, Checkbox, cn, Input, Label } from '@palladxyz/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

interface WalletInfoFormProps {
  title: string
  onSubmit: (data: { spendingPassword: string; walletName: string }) => void
}

export const WalletInfoForm = ({ title, onSubmit }: WalletInfoFormProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      walletName: '',
      spendingPassword: ''
    }
  })
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
              'flex-1 transition-opacity opacity-50',
              termsAccepted && 'opacity-100'
            ])}
            disabled={!termsAccepted}
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
          title={title}
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="gap-2">
          <Label>Wallet Name</Label>
          <Input
            placeholder="Wallet Name"
            data-testid="onboarding__walletNameInput"
            {...register('walletName')}
          />
        </div>
        <div className="gap-2">
          <Label>Spending Password</Label>
          <Input
            data-testid="onboarding__spendingPasswordInput"
            placeholder="Password"
            {...register('spendingPassword')}
          />
        </div>
        <div className="items-center gap-4">
          <Checkbox
            value={termsAccepted}
            onClick={toggleAccepted}
            data-testid="onboarding__tosCheckbox"
          />
          <label>I accept Terms of Service.</label>
        </div>
      </div>
    </WizardLayout>
  )
}
