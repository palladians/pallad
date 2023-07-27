import { Button, Card } from '@palladxyz/ui'
import {
  BookIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  MenuIcon
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: LayoutDashboardIcon, label: 'Dashboard', url: '/dashboard' },
  { icon: CoinsIcon, label: 'Staking', url: '/staking' },
  { icon: BookIcon, label: 'Contacts', url: '/contacts' },
  { icon: MenuIcon, label: 'Menu', url: '/menu' }
]

export const BottomNavigation = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <Card className="flex justify-around p-1">
      {NAV_ITEMS.map((navItem) => {
        const active = pathname === navItem.url
        return (
          <Button
            key={navItem.url}
            variant={active ? '' : 'ghost'}
            onClick={() => navigate(navItem.url)}
          >
            <navItem.icon />
          </Button>
        )
      })}
    </Card>
  )
}
