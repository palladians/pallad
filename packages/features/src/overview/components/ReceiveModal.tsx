import { Box, Heading, Modal, Text, theme } from '@palladxyz/ui'
import { Clipboard, Pressable } from 'react-native'
import QRCode from 'react-qr-code'

interface ReceiveModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  walletAddress: string
}

export const ReceiveModal = ({
  isOpen,
  setIsOpen,
  walletAddress
}: ReceiveModalProps) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} maxHeight="100%">
      <Heading>Receive</Heading>
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
    </Modal>
  )
}
