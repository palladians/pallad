import { Button, Card } from '@palladxyz/ui'
import {
  BookIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  MenuIcon
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface BottomNavigationProps {
  openCommandMenu: () => void
}

export const BottomNavigation = ({
  openCommandMenu
}: BottomNavigationProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const NAV_ITEMS = [
    {
      icon: LayoutDashboardIcon,
      label: 'Dashboard',
      url: '/dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      icon: CoinsIcon,
      label: 'Staking',
      url: '/staking',
      onClick: () => navigate('/staking')
    },
    {
      icon: BookIcon,
      label: 'Contacts',
      url: '/contacts',
      onClick: () => navigate('/contacts')
    },
    { icon: MenuIcon, label: 'Menu', onClick: openCommandMenu }
  ]
  return (
    <Card className="flex justify-around p-1">
      {NAV_ITEMS.map((navItem) => {
        const active = pathname === navItem.url
        return (
          <Button
            key={navItem.url}
            variant={active ? '' : 'ghost'}
            onClick={navItem.onClick}
          >
            <navItem.icon />
          </Button>
        )
      })}
    </Card>
  )
}
