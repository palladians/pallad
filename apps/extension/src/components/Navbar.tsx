import { Box, Text, icons, Image, composeBox } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate, useRouter } from '@tanstack/router'

export const Navbar = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const StyledPressable = composeBox({ baseComponent: Pressable })
  const isMenu = router.state.currentLocation.pathname === '/menu'
  const openNewTab = () => {
    // @ts-ignore
    chrome.tabs.create({ url: 'app.html' })
  }
  const handleMenuIcon = () => (isMenu ? navigate({ to: '/' }) : navigate({ to: '/menu' }))
  return (
    <Box
      css={{
        backgroundColor: '$black',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <Pressable onPress={() => navigate({ to: '/' })}>
        <Text css={{ color: '$white', whiteSpace: 'nowrap', width: 'auto' }}>My wallet</Text>
      </Pressable>
      <Box css={{ flex: 1 }}>
        <StyledPressable css={{ width: 24, padding: 4 }} onPress={openNewTab}>
          <Image source={icons.iconExternal} css={{ width: 20, height: 20 }} />
        </StyledPressable>
      </Box>
      <StyledPressable css={{ width: 'auto', padding: 4 }} onPress={handleMenuIcon}>
        <Image source={isMenu ? icons.iconX__white : icons.iconMenu} css={{ width: 20, height: 20, color: 'white' }} />
      </StyledPressable>
    </Box>
  )
}
