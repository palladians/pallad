import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '@/common/store/app'
import { Button } from '@/components/ui/button'
import { WizardLayout } from '@/components/wizard-layout'

export const StartView = () => {
  const [appInitialized, setAppInitialized] = useState<boolean>(false)
  const isStoreInitialized = useAppStore((state) => state.isInitialized())
  const navigate = useNavigate()
  useEffect(() => {
    const initialRedirect = async () => {
      if (!isStoreInitialized) return setAppInitialized(true)
      let spendingPassword
      try {
        spendingPassword =
          (await getSessionPersistence().getItem('spendingPassword')) || ''
      } catch {
        return navigate('/unlock')
      }
      const spendingPasswordSet = spendingPassword?.length > 0
      if (!spendingPasswordSet) return navigate('/unlock')
      let authenticated
      try {
        authenticated = (await getSecurePersistence().getItem('foo')) === 'bar'
      } catch {
        authenticated = false
      }
      if (!authenticated) return navigate('/unlock')
      return navigate('/dashboard')
    }
    initialRedirect()
  }, [isStoreInitialized])
  if (!appInitialized) return null
  return (
    <WizardLayout
      footer={
        <>
          <Button
            className="flex-1"
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
      <div className="flex flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="w-full">
          <h1 className="text-8xl text-sky-500 font-semibold break-words">
            Pallad
          </h1>
          <h2 className="text-2xl break-words">Enter The Minaverse</h2>
        </div>
        <p className="text-sm leading-2">
          Enhance your Mina adventure. Transparent and intuitively designed for
          your Web3 journey.
        </p>
      </div>
    </WizardLayout>
  )
}
