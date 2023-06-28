import { Box, Text, theme } from '@palladxyz/ui'
import { Clipboard, Pressable } from 'react-native'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useVaultStore } from '../../common/store/vault'

export const ReceiveView = () => {
  const navigate = useNavigate()
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  const walletAddress = currentWallet?.walletPublicKey
  return (
    <AppLayout>
      <Box css={{ padding: 16, flex: 1 }}>
        <ViewHeading
          title="Receive"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box
          css={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            gap: 24
          }}
        >
          <QRCode
            value={walletAddress}
            bgColor={theme.colors.gray900.value}
            fgColor={theme.colors.primary500.value}
          />
          <Pressable onPress={() => Clipboard.setString(walletAddress)}>
            <Text
              css={{
                maxWidth: 320,
                textAlign: 'center',
                border: '1px solid',
                borderColor: '$primary500',
                borderRadius: '$md',
                padding: '$sm'
              }}
              numberOfLines={2}
            >
              {walletAddress}
            </Text>
          </Pressable>
        </Box>
      </Box>
    </AppLayout>
  )
}
