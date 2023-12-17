import {
  BookIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  MenuIcon
} from 'lucide-react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

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
    <Card className="sticky bottom-4 left-0 right-0 mx-4 flex justify-between p-1 bg-background/50 backdrop-blur-md shadow-2xl">
      {NAV_ITEMS.map((navItem, i) => {
        const active = pathname === navItem.url
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
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
