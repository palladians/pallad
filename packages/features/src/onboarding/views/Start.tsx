import { getSessionPersistence } from '@palladxyz/persistence'
import { Box, Button, Text } from '@palladxyz/ui'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { useViewAnimation } from '../../common/lib/animation'
import { useAppStore } from '../../wallet/store/app'

export const StartView = () => {
  const [appInitialized, setAppInitialized] = useState<boolean>(false)
  const { scale, opacity, shift } = useViewAnimation()
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
            css={{ flex: 1, width: 'auto' }}
            onPress={() => navigate('/onboarding/restore')}
            testID="onboarding__restoreWalletButton"
          >
            Restore Wallet
          </Button>
          <Button
            variant="secondary"
            css={{ flex: 1, width: 'auto' }}
            onPress={() => navigate('/onboarding/create')}
            testID="onboarding__createWalletButton"
          >
            Create Wallet
          </Button>
        </>
      }
    >
      <Box style={{ opacity, marginTop: shift, transform: [{ scale }] }}>
        <Text
          css={{
            fontSize: 48,
            background: '-webkit-linear-gradient(45deg, #8D7AFF, #1FD7FF)',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            fontWeight: 600,
            width: 'auto'
          }}
        >
          Pallad
        </Text>
        <Text css={{ fontSize: 48, color: '$gray50' }}>
          - Mina Wallet You Deserve
        </Text>
        <Text css={{ color: '$gray100', lineHeight: '220%', marginTop: 16 }}>
          Take your Mina journey to the next level with out secure, transparent,
          and intuitive wallet interface.
        </Text>
      </Box>
    </WizardLayout>
  )
}
