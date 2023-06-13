import { MinaNetwork } from '@palladxyz/mina'
import { Box, composeBox, icons, Image, Text } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'
import { shallow } from 'zustand/shallow'

import Logo from '../assets/logo.svg'
import { useAppStore } from '../store/app'
import { useVaultStore } from '../store/vault'

export const Navbar = () => {
  const navigate = useNavigate()
  const { network, setMenuOpen } = useAppStore(
    (state) => ({
      network: state.network,
      setMenuOpen: state.setMenuOpen
    }),
    shallow
  )
  const testnetNetworkName = network !== MinaNetwork.MAINNET ? network : null
  const StyledPressable = composeBox({ baseComponent: Pressable })
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return (
    <Box
      css={{
        backgroundColor: '$gray900',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <Pressable onPress={() => navigate('/dashboard')}>
        <Image source={Logo} css={{ width: 24, height: 32 }} />
      </Pressable>
      <Pressable onPress={() => navigate('/dashboard')}>
        <Text css={{ color: '$white', whiteSpace: 'nowrap', width: 'auto' }}>
          {testnetNetworkName && `[${testnetNetworkName}] `}
          {currentWallet?.walletName}
        </Text>
      </Pressable>
      <Box css={{ flex: 1 }}>
        {/*<StyledPressable css={{ width: 24, padding: 4 }} onPress={openNewTab}>*/}
        {/*  <Image source={icons.iconExternal} css={{ width: 20, height: 20 }} />*/}
        {/*</StyledPressable>*/}
      </Box>
      <StyledPressable
        css={{ width: 'auto', padding: 4 }}
        onPress={() => setMenuOpen(true)}
      >
        <Image
          source={icons.iconMenu}
          css={{ width: 20, height: 20, color: 'white' }}
        />
      </StyledPressable>
    </Box>
  )
}
