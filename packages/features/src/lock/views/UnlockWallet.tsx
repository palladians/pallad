import { getSessionPersistence } from '@palladxyz/persistence'
import {
  Alert,
  AlertTitle,
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@palladxyz/ui'
import { useVault } from '@palladxyz/vault'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

export const UnlockWalletView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const [passwordError, setPasswordError] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  const onError = async () => {
    await getSessionPersistence().setItem('spendingPassword', '')
    return setPasswordError(true)
  }
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    useVault.destroy()
    useVault.persist.rehydrate()
    if (!currentWallet) return await onError()
    return navigate('/dashboard')
  }
  return (
    <WizardLayout
      footer={
        <Button
          type="submit"
          className="flex-1"
          form="unlockWalletForm"
          data-testid="unlockWallet__unlockButton"
        >
          Unlock
        </Button>
      }
    >
      <div className="flex flex-col flex-1 gap-6">
        <ViewHeading
          title="Unlock Wallet"
          button={{
            label: 'Restart Wallet',
            onClick: () => console.log('restart')
          }}
        />
        {passwordError && (
          <Alert
            variant="destructive"
            className="flex items-center"
            data-testid="unlockWallet__error"
          >
            <AlertCircleIcon />
            <AlertTitle>The password is wrong</AlertTitle>
          </Alert>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
          id="unlockWalletForm"
        >
          <Label htmlFor="spendingPassword" className="cursor-pointer">
            Spending Password
          </Label>
          <div className="flex gap-2">
            <Input
              id="spendingPassword"
              type={showPassword ? 'text' : 'password'}
              data-testid="unlockWallet__password"
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
        </form>
      </div>
    </WizardLayout>
  )
}
