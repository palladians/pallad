import { getSessionPersistence } from '@palladxyz/persistence'
import { Alert, AlertTitle, Button, Input, Label } from '@palladxyz/ui'
import { keyAgentStore } from '@palladxyz/vault'
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'

export const UnlockWalletView = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { wallet } = useWallet()
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
    keyAgentStore.destroy()
    await keyAgentStore.persist.rehydrate()
    const currentWallet = wallet.getCurrentWallet()
    if (!currentWallet) return await onError()
    return navigate('/dashboard')
  }
  // const restartWallet = () => {
  // resetWallet()
  // navigate('/')
  // }
  return (
    <WizardLayout
      footer={
        <Button type="submit" className="flex-1" form="unlockWalletForm">
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
          <Alert variant="destructive" className="flex items-center">
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
              autoFocus
              {...register('spendingPassword')}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </form>
      </div>
    </WizardLayout>
  )
}
