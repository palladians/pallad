import { Box, Button, icons } from '@palladxyz/ui'
import { Navbar } from '@/components/Navbar'
import { useNavigate } from '@tanstack/router'
import { secureStorage, sessionData } from '@/lib/storage.ts'

export const MenuView = () => {
  const navigate = useNavigate()
  const MENU_ITEMS = [
    {
      label: 'Transaction',
      onPress: () => navigate({ to: '/' }),
      icon: icons.iconTransactions
    },
    { label: 'Staking', onPress: () => navigate({ to: '/' }), icon: icons.iconStaking },
    { label: 'Network', onPress: () => navigate({ to: '/' }), icon: icons.iconNetwork },
    { label: 'Settings', onPress: () => navigate({ to: '/' }), icon: icons.iconSettings },
    { label: 'About', onPress: () => navigate({ to: '/' }), icon: icons.iconAbout },
    {
      label: 'Lock',
      onPress: () => {
        sessionData.set('spendingPassword', null)
        return navigate({ to: '/unlock' })
      },
      icon: icons.iconLock
    }
  ]
  return (
    <Box css={{ flex: 1, backgroundColor: '$gray900' }}>
      <Navbar />
      <Box css={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
        {MENU_ITEMS.map((menuItem, i) => (
          <Button
            key={i}
            css={{ justifyContent: 'flex-start' }}
            size="lg"
            leftIcon={menuItem.icon}
            onPress={menuItem.onPress}
          >
            {menuItem.label}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
