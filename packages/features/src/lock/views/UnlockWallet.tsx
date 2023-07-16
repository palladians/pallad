import { getSessionPersistence } from '@palladxyz/persistence'
import { Button, Input } from '@palladxyz/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AlertCircleIcon } from 'lucide-react'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
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
      <div className="gap-6">
        <ViewHeading
          title="Unlock Wallet"
          button={{
            label: 'Restart Wallet',
            onClick: () => console.log('restart')
          }}
        />
        {passwordError && (
          <div className="bg-red-800 p-2 rounded-md gap-2 items-center">
            <AlertCircleIcon />
            <p className="text-red-400">The password is wrong</p>
          </div>
        )}
        <div className="gap-2">
          <FormLabel>Spending Password</FormLabel>
          <Input autoFocus {...register('spendingPassword')} />
        </div>
      </div>
    </WizardLayout>
  )
}
