import {
  Button,
  Card,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@palladxyz/ui'
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
      testId: 'bottomNavigation__dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      icon: CoinsIcon,
      label: 'Staking',
      url: '/staking',
      testId: 'bottomNavigation__staking',
      onClick: () => navigate('/staking')
    },
    {
      icon: BookIcon,
      label: 'Contacts',
      url: '/contacts',
      testId: 'bottomNavigation__addressBook',
      onClick: () => navigate('/contacts')
    },
    {
      icon: MenuIcon,
      label: 'Menu ⌘K',
      testId: 'bottomNavigation__menu',
      onClick: openCommandMenu
    }
  ]
  return (
    <Card className="flex justify-around p-1">
      {NAV_ITEMS.map((navItem) => {
        const active = pathname === navItem.url
        return (
          <Tooltip key={navItem.url}>
            <TooltipTrigger>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                onClick={navItem.onClick}
                data-testid={navItem.testId}
              >
                <navItem.icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{navItem.label}</p>
            </TooltipContent>
          </Tooltip>
        )
      })}
    </Card>
  )
}
