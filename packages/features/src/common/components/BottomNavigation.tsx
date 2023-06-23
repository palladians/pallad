import { Box, composeBox, icons, Image, Text } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useLocation } from 'react-router-native'

import { useAppStore } from '../store/app'

const StyledPressable = composeBox({ baseComponent: Pressable })

const MenuItem = ({ label, url, icon, iconActive, onPress }) => {
  const location = useLocation()
  const isActive = location.pathname === url
  return (
    <StyledPressable
      css={{
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
      }}
      onPress={onPress}
    >
      <Image
        source={isActive ? iconActive : icon}
        css={{
          width: 24,
          height: 24
        }}
      />
      <Text css={{ color: isActive ? '$primary500' : '$body', fontSize: 12 }}>
        {label}
      </Text>
    </StyledPressable>
  )
}

export const BottomNavigation = () => {
  const setMenuOpen = useAppStore((state) => state.setMenuOpen)
  return (
    <Box
      css={{
        flexDirection: 'row',
        padding: '$sm',
        justifyContent: 'space-evenly'
      }}
    >
      <MenuItem
        label="Dashboard"
        url="/dashboard"
        icon={icons.iconDashboard}
        iconActive={icons.iconDashboard__active}
      />
      <MenuItem label="Staking" url="/staking" icon={icons.iconStaking} />
      <MenuItem label="Swap" url="/swap" icon={icons.iconTransactions} />
      <MenuItem
        label="Menu"
        icon={icons.iconMenu}
        onPress={() => setMenuOpen(true)}
      />
    </Box>
  )
}
