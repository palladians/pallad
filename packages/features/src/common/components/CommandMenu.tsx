import { getSessionPersistence } from '@palladxyz/persistence'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@palladxyz/ui'
import { keyAgentStore } from '@palladxyz/vault'
import {
  ArrowRightLeftIcon,
  BookIcon,
  CoinsIcon,
  InfoIcon,
  LayoutDashboardIcon,
  ListIcon,
  LockIcon,
  ReplaceIcon,
  SettingsIcon
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CommandMenu = ({ open, setOpen }: CommandMenuProps) => {
  const navigate = useNavigate()

  const lockWallet = () => {
    getSessionPersistence().setItem('spendingPassword', '')
    keyAgentStore.destroy()
    keyAgentStore.persist.rehydrate()
    return navigate('/')
  }

  const COMMAND_GROUPS = [
    {
      name: 'General',
      items: [
        {
          name: 'Dashboard',
          icon: LayoutDashboardIcon,
          onSelect: () => navigate('/dashboard')
        },
        {
          name: 'Address Book',
          icon: BookIcon,
          onSelect: () => navigate('/contacts')
        }
      ]
    },
    {
      name: 'Transactions',
      items: [
        {
          name: 'Transactions',
          icon: ListIcon,
          onSelect: () => navigate('/transactions')
        },
        {
          name: 'New Transaction',
          icon: ArrowRightLeftIcon,
          onSelect: () => navigate('/send')
        }
      ]
    },
    {
      name: 'Staking',
      items: [
        {
          name: 'Staking',
          icon: CoinsIcon,
          onSelect: () => navigate('/staking')
        },
        {
          name: 'Change Delegation',
          icon: ReplaceIcon,
          onSelect: () => navigate('/staking/delegate')
        }
      ]
    },
    {
      name: 'Wallet',
      items: [
        {
          name: 'Settings',
          icon: SettingsIcon,
          onSelect: () => navigate('/settings')
        },
        {
          name: 'About',
          icon: InfoIcon,
          onSelect: () => navigate('/about')
        },
        {
          name: 'Lock Wallet',
          icon: LockIcon,
          onSelect: lockWallet
        }
      ]
    }
  ]

  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && e.metaKey) {
      setOpen(!open)
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {COMMAND_GROUPS.map((group, i) => (
          <CommandGroup key={i} heading={group.name}>
            {group.items.map((item, j) => (
              <CommandItem
                key={j}
                onSelect={() => {
                  item.onSelect()
                  setOpen(false)
                }}
              >
                <item.icon className="mr-2" />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
