import { Box, Button } from '@palladxyz/ui'
import { Navbar } from '@/components/Navbar.tsx'

const MENU_ITEMS = [
  { label: 'Transaction', url: '/transactions' },
  { label: 'Staking', url: '/staking' },
  { label: 'Network', url: '/network' },
  { label: 'Settings', url: '/settings' },
  {
    label: 'Lock',
    onClick: () => {
      console.log('>>>LOCK')
    }
  }
]

export const MenuView = () => {
  return (
    <Box css={{ flex: 1, backgroundColor: '$black' }}>
      <Navbar />
      <Box css={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
        {MENU_ITEMS.map((menuItem, i) => (
          <Button key={i} css={{ alignItems: 'flex-start' }}>
            {menuItem.label}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
