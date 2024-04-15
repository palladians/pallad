import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '@/common/store/app'

import { StartView } from '../views/start'

export const StartRoute = () => {
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
    <StartView
      onCreateClicked={() => navigate('/onboarding/create')}
      onRestoreClicked={() => navigate('/onboarding/restore')}
    />
  )
}
