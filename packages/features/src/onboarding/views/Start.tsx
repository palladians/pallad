import { getSessionPersistence } from '@palladxyz/persistence'
import { Button } from '@palladxyz/ui'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { useAppStore } from '../../wallet/store/app'

export const StartView = () => {
  const [appInitialized, setAppInitialized] = useState<boolean>(false)
  const isInitialized = useAppStore((state) => state.isInitialized())
  const navigate = useNavigate()
  useEffect(() => {
    const initialRedirect = async () => {
      const spendingPassword =
        (await getSessionPersistence().getItem('spendingPassword')) || ''
      const spendingPasswordSet = spendingPassword.length > 0
      setAppInitialized(true)
      if (!isInitialized) return
      if (isInitialized && !spendingPasswordSet) return navigate('/unlock')
      return navigate('/dashboard')
    }
    initialRedirect()
  }, [isInitialized])
  if (!appInitialized) return null
  return (
    <WizardLayout
      footer={
        <>
          <Button
            onClick={() => navigate('/onboarding/restore')}
            data-testid="onboarding__restoreWalletButton"
          >
            Restore Wallet
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate('/onboarding/create')}
            data-testid="onboarding__createWalletButton"
          >
            Create Wallet
          </Button>
        </>
      }
    >
      <div>
        <h1 className="text-5xl text-sky-500 font-semibold">Pallad</h1>
        <h2 className="text-5xl text-gray-500">- Mina Wallet You Deserve</h2>
        <p className="text-gray-100 leading-5 mt-16">
          Take your Mina journey to the next level with out secure, transparent,
          and intuitive wallet interface.
        </p>
      </div>
    </WizardLayout>
  )
}
