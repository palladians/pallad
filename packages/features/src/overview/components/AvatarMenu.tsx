import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@palladxyz/ui'
import { LockIcon, SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from '../../common/hooks/useAccount'

export const AvatarMenu = () => {
  const { gradientBackground } = useAccount()
  const navigate = useNavigate()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>
            <div
              className="w-full h-full cursor-pointer"
              style={{ backgroundImage: gradientBackground }}
            />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <SettingsIcon className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log('not yet')}>
          <LockIcon className="mr-2 h-4 w-4" />
          <span>Lock Wallet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
