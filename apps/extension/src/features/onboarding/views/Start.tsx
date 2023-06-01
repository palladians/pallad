import { Box, Button, Image, Text } from '@palladxyz/ui'
import Logo from '../../../assets/logo.svg'

export const StartView = () => {
  return (
    <Box css={{ backgroundColor: '$black', flex: 1, padding: 16 }}>
      <Box>
        <Image source={Logo} css={{ width: 36, height: 42 }} />
      </Box>
      <Box css={{ flex: 1, justifyContent: 'center' }}>
        <Text
          css={{
            fontSize: 48,
            background: '-webkit-linear-gradient(45deg, #8D7AFF, #1FD7FF)',
            color: 'transparent',
            '-webkit-background-clip': 'text',
            fontWeight: 600
          }}
        >
          Pallad
        </Text>
        <Text css={{ fontSize: 48, color: '$white' }}>- Mina Wallet You Deserve</Text>
        <Text css={{ color: '$white', lineHeight: '220%', marginTop: 16 }}>
          Take your Mina journey to the next level with out secure, transparent, and intuitive wallet interface.
        </Text>
      </Box>
      <Box css={{ flexDirection: 'row', gap: 8 }}>
        <Button css={{ flex: 1, width: 'auto' }}>Restore Existing Wallet</Button>
        <Button variant="secondary" css={{ flex: 1, width: 'auto' }}>
          Create New Wallet
        </Button>
      </Box>
    </Box>
  )
}
