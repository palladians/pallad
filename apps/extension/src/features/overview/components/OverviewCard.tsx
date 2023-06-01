import { Box, Button, icons, Image, Text } from '@palladxyz/ui'
import { Pressable, Clipboard } from 'react-native'
import easyMeshGradient from 'easy-mesh-gradient'

interface OverviewCardProps {
  walletAddress: string
}

export const OverviewCard = ({ walletAddress }: OverviewCardProps) => {
  const meshGradient = easyMeshGradient({
    seed: walletAddress,
    lightnessRange: [0.8, 1]
  })
  return (
    <Box
      css={{
        width: '100%',
        height: 232,
        backgroundImage: meshGradient,
        borderRadius: 4,
        padding: 16,
        gap: 16,
        position: 'relative',
        zIndex: 0
      }}
    >
      <Image
        source={icons.noise}
        css={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 0 }}
      />
      <Box css={{ gap: 8 }}>
        <Text css={{ fontSize: 14, fontWeight: 500 }}>Wallet Balance</Text>
        <Text css={{ fontSize: 24, fontWeight: 700 }}>361.0465 MINA</Text>
        <Text css={{ fontSize: 14, fontWeight: 700 }}>361.0465 USD</Text>
      </Box>
      <Box css={{ gap: 8 }}>
        <Text css={{ fontSize: 14, fontWeight: 500 }}>Wallet Address</Text>
        <Box css={{ flexDirection: 'row', gap: 8 }}>
          <Text
            css={{
              fontSize: 16,
              flex: 1,
              fontWeight: 700
            }}
            numberOfLines={1}
          >
            {walletAddress}
          </Text>
          <Pressable onPress={() => Clipboard.setString(walletAddress)}>
            <Image source={icons.iconCopy} css={{ width: 20, height: 20 }} />
          </Pressable>
        </Box>
      </Box>
      <Box css={{ flexDirection: 'row', gap: 8 }}>
        <Button variant="secondary" css={{ flex: 1 }}>
          Send
        </Button>
        <Button variant="secondary" css={{ flex: 1 }}>
          Receive
        </Button>
      </Box>
    </Box>
  )
}
