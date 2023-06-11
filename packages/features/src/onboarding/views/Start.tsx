import { Button, Text } from '@palladxyz/ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-native'

import { WizardLayout } from '../../common/components'
import { VaultState } from '../../common/lib/const'
import { useLocalWallet } from '../../common/lib/hooks'
import { sessionData } from '../../common/lib/storage'

export const StartView = () => {
  const [wallet] = useLocalWallet()
  const navigate = useNavigate()
  useEffect(() => {
    const initialRedirect = async () => {
      const spendingPassword = await sessionData.get('spendingPassword')
      const initializedVault =
        wallet?.vaultState === VaultState[VaultState.INITIALIZED]
      if (!initializedVault) return
      if (initializedVault && !spendingPassword) return navigate('/unlock')
      return navigate('/dashboard')
    }
    initialRedirect()
  }, [wallet])
  return (
    <WizardLayout
      footer={
        <>
          <Button
            css={{ flex: 1, width: 'auto' }}
            onPress={() => navigate('/restore')}
          >
            Restore Wallet
          </Button>
          <Button
            variant="secondary"
            css={{ flex: 1, width: 'auto' }}
            onPress={() => navigate('/create')}
          >
            Create Wallet
          </Button>
        </>
      }
    >
      <>
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
      </>
    </WizardLayout>
  )
}
