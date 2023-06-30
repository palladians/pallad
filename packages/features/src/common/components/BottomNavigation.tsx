import { Box, composeBox, Icons, Text, theme } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useLocation, useNavigate } from 'react-router-native'

const StyledPressable = composeBox({ baseComponent: Pressable })

const MenuItem = ({ label, url, Icon, onPress }) => {
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
      <Icon
        color={
          isActive ? theme.colors.primary500.value : theme.colors.gray50.value
        }
      />
      <Text css={{ color: isActive ? '$primary500' : '$body', fontSize: 12 }}>
        {label}
      </Text>
    </StyledPressable>
  )
}

export const BottomNavigation = () => {
  const navigate = useNavigate()
  return (
    <Box
      css={{
        flexDirection: 'row',
        padding: '$sm',
        justifyContent: 'space-around'
      }}
    >
      <MenuItem
        label="Dashboard"
        url="/dashboard"
        Icon={Icons.LayoutDashboard}
        onPress={() => navigate('/dashboard')}
      />
      <MenuItem
        label="Staking"
        url="/staking"
        onPress={() => navigate('/staking')}
        Icon={Icons.Coins}
      />
      <MenuItem
        label="Address Book"
        url="/contacts"
        onPress={() => navigate('/contacts')}
        Icon={Icons.Contact}
      />
      <MenuItem
        label="Menu"
        Icon={Icons.Menu}
        url="/menu"
        onPress={() => navigate('/menu')}
      />
    </Box>
  )
}
