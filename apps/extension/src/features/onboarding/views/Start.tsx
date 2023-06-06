import { Button, Text } from '@palladxyz/ui'
import { WizardLayout } from '@/components'
import { useNavigate } from '@tanstack/router'

export const StartView = () => {
  const navigate = useNavigate()
  return (
    <WizardLayout
      footer={
        <>
          <Button css={{ flex: 1, width: 'auto' }} onPress={() => navigate({ to: '/restore' })}>
            Restore Wallet
          </Button>
          <Button variant="secondary" css={{ flex: 1, width: 'auto' }} onPress={() => navigate({ to: '/create' })}>
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
        <Text css={{ fontSize: 48, color: '$gray50' }}>- Mina Wallet You Deserve</Text>
        <Text css={{ color: '$gray100', lineHeight: '220%', marginTop: 16 }}>
          Take your Mina journey to the next level with out secure, transparent, and intuitive wallet interface.
        </Text>
      </>
    </WizardLayout>
  )
}
