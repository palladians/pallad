import { Button, Card } from '@palladxyz/ui'
import {
  CoinsIcon,
  LayoutDashboardIcon,
  BookIcon,
  MenuIcon
} from 'lucide-react'

export const BottomNavigation = () => {
  return (
    <Card className="flex justify-around p-1">
      <Button variant="ghost">
        <LayoutDashboardIcon />
        <span className="hidden">Dashboard</span>
      </Button>
      <Button variant="ghost">
        <CoinsIcon />
        <span className="hidden">Staking</span>
      </Button>
      <Button variant="ghost">
        <BookIcon />
        <span className="hidden">Contacts</span>
      </Button>
      <Button variant="ghost">
        <MenuIcon />
        <span className="hidden">Menu</span>
      </Button>
    </Card>
  )
}
