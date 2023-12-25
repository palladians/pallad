import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '@/common/store/app'
import { ButtonArrow } from '@/components/button-arrow'
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
      textLogo
      footer={
        <div className="flex flex-1 flex-col gap-2">
          <Button
            className="flex-1 gap-2 group"
            onClick={() => navigate('/onboarding/restore')}
            data-testid="onboarding__restoreWalletButton"
          >
            <span>Restore an existing wallet</span>
            <ButtonArrow />
          </Button>
          <Button
            variant="secondary"
            className="flex-1 gap-2 group"
            onClick={() => navigate('/onboarding/create')}
            data-testid="onboarding__createWalletButton"
          >
            <span>Create a new wallet</span>
            <ButtonArrow />
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
        <img src="/intro.png" className="w-[220px]" />
        <p className="leading-7 text-muted-foreground">
          Your gateway to Minaverse.
        </p>
      </div>
    </WizardLayout>
  )
}
