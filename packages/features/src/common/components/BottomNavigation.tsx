import { Box, composeBox, Icons, theme } from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useLocation, useNavigate } from 'react-router-native'

const StyledPressable = composeBox({ baseComponent: Pressable })

const MenuItem = ({ url, Icon, onPress }) => {
  const location = useLocation()
  const isActive = location.pathname === url
  return (
    <StyledPressable
      css={{
        width: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '$sm',
        borderRadius: '50%',
        position: 'relative'
      }}
      onPress={onPress}
    >
      <Box css={{ padding: '$sm' }}>
        <Icon
          color={
            isActive
              ? theme.colors.primary400.value
              : theme.colors.gray100.value
          }
        />
      </Box>
      <Box
        css={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          height: '16px',
          width: '100%',
          backgroundColor: isActive ? '$primary400' : 'transparent',
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px',
          filter: 'blur(16px)',
          opacity: 0.3
        }}
      />
      <Box
        css={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          height: '2px',
          width: '100%',
          backgroundColor: isActive ? '$primary400' : 'transparent',
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px'
        }}
      />
    </StyledPressable>
  )
}

export const BottomNavigation = () => {
  const navigate = useNavigate()
  return (
    <Box
      css={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTop: `1px ${theme.colors.gray700.value} solid`
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
        Icon={Icons.Book}
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
