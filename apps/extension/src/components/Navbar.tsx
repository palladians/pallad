import { Box, Text, icons, Image, composeBox } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate, useRouter } from '@tanstack/router'
import Logo from '../assets/logo.svg'
import { useVaultStore } from '@/store/vault.ts'

export const Navbar = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const StyledPressable = composeBox({ baseComponent: Pressable })
  const isMenu = router.state.currentLocation.pathname === '/menu'
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  // const openNewTab = () => {
  //   // @ts-ignore
  //   chrome.tabs.create({ url: 'app.html' })
  // }
  const handleMenuIcon = () => (isMenu ? navigate({ to: '/' }) : navigate({ to: '/menu' }))
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
      <Pressable onPress={() => navigate({ to: '/' })}>
        <Image source={Logo} css={{ width: 24, height: 32 }} />
      </Pressable>
      <Pressable onPress={() => navigate({ to: '/' })}>
        <Text css={{ color: '$white', whiteSpace: 'nowrap', width: 'auto' }}>{currentWallet?.walletName}</Text>
      </Pressable>
      <Box css={{ flex: 1 }}>
        {/*<StyledPressable css={{ width: 24, padding: 4 }} onPress={openNewTab}>*/}
        {/*  <Image source={icons.iconExternal} css={{ width: 20, height: 20 }} />*/}
        {/*</StyledPressable>*/}
      </Box>
      <StyledPressable css={{ width: 'auto', padding: 4 }} onPress={handleMenuIcon}>
        <Image source={isMenu ? icons.iconX__white : icons.iconMenu} css={{ width: 20, height: 20, color: 'white' }} />
      </StyledPressable>
    </Box>
  )
}
