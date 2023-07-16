import { useLocation } from 'react-router-dom'
import { Button, Card } from '@palladxyz/ui'
import {
  CoinsIcon,
  LayoutDashboardIcon,
  BookIcon,
  MenuIcon
} from 'lucide-react'

const MenuItem = ({ url, Icon, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === url
  return (
    <p>Bnav</p>
    //     <StyledPressable
    //       css={{
    //         width: 'auto',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         gap: 4,
    //         padding: '$sm',
    //         borderRadius: '50%',
    //         position: 'relative'
    //       }}
    //       onClick={onClick}
    //     >
    //       <Box css={{ padding: '$sm' }}>
    //         <Icon
    //           color={
    //             isActive
    //               ? theme.colors.primary400.value
    //               : theme.colors.gray100.value
    //           }
    //         />
    //       </Box>
    //       <Box
    //         css={{
    //           position: 'absolute',
    //           left: 0,
    //           bottom: 0,
    //           right: 0,
    //           height: '16px',
    //           width: '100%',
    //           backgroundColor: isActive ? '$primary400' : 'transparent',
    //           borderTopLeftRadius: '2px',
    //           borderTopRightRadius: '2px',
    //           filter: 'blur(16px)',
    //           opacity: 0.3
    //         }}
    //       />
    //       <Box
    //         css={{
    //           position: 'absolute',
    //           left: 0,
    //           bottom: 0,
    //           right: 0,
    //           height: '2px',
    //           width: '100%',
    //           backgroundColor: isActive ? '$primary400' : 'transparent',
    //           borderTopLeftRadius: '2px',
    //           borderTopRightRadius: '2px'
    //         }}
    //       />
    //     </StyledPressable>
  )
}
//
export const BottomNavigation = () => {
  //   const navigate = useNavigate()
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
    //     <Box
    //       css={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-evenly',
    //         borderTop: `1px ${theme.colors.gray700.value} solid`
    //       }}
    //     >
    //       <MenuItem
    //         label="Dashboard"
    //         url="/dashboard"
    //         Icon={Icons.LayoutDashboard}
    //         onClick={() => navigate('/dashboard')}
    //       />
    //       <MenuItem
    //         label="Staking"
    //         url="/staking"
    //         onClick={() => navigate('/staking')}
    //         Icon={Icons.Coins}
    //       />
    //       <MenuItem
    //         label="Address Book"
    //         url="/contacts"
    //         onClick={() => navigate('/contacts')}
    //         Icon={Icons.Book}
    //       />
    //       <MenuItem
    //         label="Menu"
    //         Icon={Icons.Menu}
    //         url="/menu"
    //         onClick={() => navigate('/menu')}
    //       />
    //     </Box>
  )
}
