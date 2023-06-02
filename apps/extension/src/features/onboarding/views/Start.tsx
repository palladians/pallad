import { Button, Text } from '@palladxyz/ui'
import { WizardLayout } from '@/components/WizardLayout'
import { useNavigate } from '@tanstack/router'

export const StartView = () => {
  const navigate = useNavigate()
  return (
    <WizardLayout
      footer={
        <>
          <Button css={{ flex: 1, width: 'auto' }}>Restore Wallet</Button>
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
        <Text css={{ fontSize: 48, color: '$white' }}>- Mina Wallet You Deserve</Text>
        <Text css={{ color: '$white', lineHeight: '220%', marginTop: 16 }}>
          Take your Mina journey to the next level with out secure, transparent, and intuitive wallet interface.
        </Text>
      </>
    </WizardLayout>
  )
}
