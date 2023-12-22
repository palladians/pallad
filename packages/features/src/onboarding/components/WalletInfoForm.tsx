import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { FormError } from '@/common/components/FormError'
import { passwordSchema } from '@/common/lib/validation'
import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

interface WalletInfoFormProps {
  title: string
  onSubmit: (data: { spendingPassword: string; walletName: string }) => void
}

const formSchema = z.object({
  walletName: z.string().min(1).max(48),
  spendingPassword: passwordSchema
})

export const WalletInfoForm = ({ title, onSubmit }: WalletInfoFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      walletName: '',
      spendingPassword: ''
    },
    resolver: zodResolver(formSchema)
  })
  return (
    <WizardLayout
      footer={
        <Button
          variant="secondary"
          className={cn([
            'flex-1 transition-opacity opacity-50 gap-2 group',
            termsAccepted && 'opacity-100'
          ])}
          disabled={!termsAccepted}
          onClick={handleSubmit(onSubmit)}
          data-testid="onboarding__nextButton"
        >
          <span>Next</span>
          <ButtonArrow />
        </Button>
      }
    >
      <div className="flex flex-col flex-1">
        <ViewHeading
          title={title}
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <div className="gap-2">
            <Label
              htmlFor="walletNameInput"
              className={cn(
                'cursor-pointer',
                errors.walletName && 'text-destructive'
              )}
            >
              Wallet Name
            </Label>
            <Input
              id="walletNameInput"
              placeholder="Wallet Name"
              data-testid="onboarding__walletNameInput"
              className={cn(errors.walletName && 'border-destructive')}
              {...register('walletName')}
            />
            <FormError>{errors.walletName?.message}</FormError>
          </div>
          <div className="gap-2">
            <Label
              htmlFor="spendingPassword"
              className={cn(
                'cursor-pointer',
                errors.spendingPassword && 'text-destructive'
              )}
            >
              Spending Password
            </Label>
            <div className="flex gap-2">
              <Input
                id="spendingPassword"
                type={showPassword ? 'text' : 'password'}
                data-testid="onboarding__spendingPasswordInput"
                placeholder="Password"
                className={cn(errors.spendingPassword && 'border-destructive')}
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
            <FormError>{errors.spendingPassword?.message}</FormError>
          </div>
          <div className="flex items-center gap-4">
            <Checkbox
              checked={termsAccepted}
              onClick={toggleAccepted}
              data-testid="onboarding__tosCheckbox"
              id="tosCheckbox"
            />
            <Label htmlFor="tosCheckbox" className="cursor-pointer">
              I accept Terms of Service.
            </Label>
          </div>
        </div>
      </div>
    </WizardLayout>
  )
}
