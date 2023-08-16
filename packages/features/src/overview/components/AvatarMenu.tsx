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

import { useWallet } from '../../wallet/hooks/useWallet'

export const AvatarMenu = () => {
  const navigate = useNavigate()
  const { gradientBackground, lockWallet } = useWallet()
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
        <DropdownMenuItem onClick={lockWallet}>
          <LockIcon className="mr-2 h-4 w-4" />
          <span>Lock Wallet</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
