import { getSessionPersistence } from '@palladxyz/persistence'
import { Alert, AlertTitle, Button, Input, Label } from '@palladxyz/ui'
import { keyAgentStore } from '@palladxyz/vault'
import { AlertCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'

export const UnlockWalletView = () => {
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
        <Button onClick={handleSubmit(onSubmit)} className="flex-1">
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="spendingPassword" className="cursor-pointer">
            Spending Password
          </Label>
          <Input
            id="spendingPassword"
            type="password"
            autoFocus
            {...register('spendingPassword')}
          />
        </div>
      </div>
    </WizardLayout>
  )
}
