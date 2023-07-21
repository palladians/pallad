import { Button, Checkbox, cn, Input, Label } from '@palladxyz/ui'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
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
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title={title}
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="gap-2">
          <Label htmlFor="walletNameInput" className="cursor-pointer">
            Wallet Name
          </Label>
          <Input
            id="walletNameInput"
            placeholder="Wallet Name"
            data-testid="onboarding__walletNameInput"
            {...register('walletName')}
          />
        </div>
        <div className="gap-2">
          <Label htmlFor="spendingPasswordInput" className="cursor-pointer">
            Spending Password
          </Label>
          <div className="flex gap-2">
            <Input
              id="spendingPasswordInput"
              type={showPassword ? 'text' : 'password'}
              data-testid="onboarding__spendingPasswordInput"
              placeholder="Password"
              {...register('spendingPassword')}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Checkbox
            value={termsAccepted}
            onClick={toggleAccepted}
            data-testid="onboarding__tosCheckbox"
            id="tosCheckbox"
          />
          <Label htmlFor="tosCheckbox" className="cursor-pointer">
            I accept Terms of Service.
          </Label>
        </div>
      </div>
    </WizardLayout>
  )
}
