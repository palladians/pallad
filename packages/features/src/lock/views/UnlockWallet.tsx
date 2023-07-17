import { getSessionPersistence } from '@palladxyz/persistence'
import { Alert, AlertTitle, Button, Input, Label } from '@palladxyz/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AlertCircleIcon } from 'lucide-react'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

export const UnlockWalletView = () => {
  const [passwordError, setPasswordError] = useState(true)
  console.log('>>PE', setPasswordError)
  const navigate = useNavigate()
  // const getCurrentWallet = useVaultStore((state) => state.getCurrentWallet)
  // const resetWallet = useVaultStore((state) => state.reset)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      spendingPassword: ''
    }
  })
  // const onError = async () => {
  //   await getSessionPersistence().setItem('spendingPassword', '')
  //   return setPasswordError(true)
  // }
  const onSubmit = async ({
    spendingPassword
  }: {
    spendingPassword: string
  }) => {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    // await vaultStore.destroy()
    // await vaultStore.persist.rehydrate()
    // const wallet = await getCurrentWallet()
    // if (!wallet) return await onError()
    return navigate('/dashboard')
  }
  const restartWallet = () => {
    // resetWallet()
    navigate('/')
  }
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
            autoFocus
            {...register('spendingPassword')}
          />
        </div>
      </div>
    </WizardLayout>
  )
}
