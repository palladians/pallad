import { zodResolver } from '@hookform/resolvers/zod'
import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
import { useVault } from '@palladxyz/vault'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAccount } from '@/common/hooks/use-account'
import { passwordSchema } from '@/common/lib/validation'
import { ButtonArrow } from '@/components/button-arrow'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ViewHeading } from '@/components/view-heading'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  spendingPassword: passwordSchema
})

export const UnlockWalletView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { restartCurrentWallet } = useAccount()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      spendingPassword: ''
    },
    resolver: zodResolver(formSchema)
  })
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await useVault.persist.rehydrate()
    setTimeout(() => {
      setError('spendingPassword', {
        type: 'wrongPassword',
        message: 'The spending password is wrong'
      })
    }, 100)
  }
  useEffect(() => {
    const unsub = useVault.persist.onFinishHydration(async () => {
      const authenticated =
        (await getSecurePersistence().getItem('foo')) === 'bar'
      if (!authenticated) {
        await getSessionPersistence().removeItem('spendingPassword')
        return setError('spendingPassword', {
          type: 'wrongPassword',
          message: 'The spending password is wrong'
        })
      }
      navigate('/dashboard')
    })
    return () => unsub()
  }, [])
  return (
    <WizardLayout
      footer={
        <Button
          type="submit"
          className="flex-1 group gap-2 animate-in slide-in-from-bottom-4 fade-in delay-100 fill-mode-both"
          form="unlockWalletForm"
          data-testid="unlockWallet__unlockButton"
        >
          <span>Unlock</span>
          <ButtonArrow />
        </Button>
      }
    >
      <div className="animate-in slide-in-from-bottom-4 flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Unlock Wallet"
          button={{
            label: 'Restart Wallet',
            onClick: restartCurrentWallet
          }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
            id="unlockWalletForm"
          >
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
                data-testid="unlockWallet__password"
                className={cn(errors.spendingPassword && 'border-destructive')}
                autoFocus
                {...register('spendingPassword')}
              />
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-testid="unlockWallet__togglePasswordVisible"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? 'Hide password' : 'Show password'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <FormError>{errors.spendingPassword?.message}</FormError>
          </form>
        </div>
      </div>
    </WizardLayout>
  )
}
