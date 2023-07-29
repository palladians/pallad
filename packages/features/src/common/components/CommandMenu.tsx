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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const lockWallet = () => {
    getSessionPersistence().setItem('spendingPassword', '')
    keyAgentStore.destroy()
    keyAgentStore.persist.rehydrate()
    return navigate('/')
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem onSelect={() => navigate('/dashboard')}>
            <LayoutDashboardIcon className="mr-2" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate('/contacts')}>
            <BookIcon className="mr-2" />
            Address Book
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Transactions">
          <CommandItem>
            <ArrowRightLeftIcon className="mr-2" />
            New Transaction
          </CommandItem>
          <CommandItem onSelect={() => navigate('/transactions')}>
            <ListIcon className="mr-2" />
            Transactions
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Staking">
          <CommandItem onSelect={() => navigate('/staking')}>
            <CoinsIcon className="mr-2" />
            Staking
          </CommandItem>
          <CommandItem>
            <ReplaceIcon className="mr-2" />
            Change delegation
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Menu">
          <CommandItem onSelect={() => navigate('/settings')}>
            <SettingsIcon className="mr-2" />
            Settings
          </CommandItem>
          <CommandItem onSelect={() => navigate('/about')}>
            <InfoIcon className="mr-2" />
            About
          </CommandItem>
          <CommandItem onSelect={lockWallet}>
            <LockIcon className="mr-2" />
            Lock Wallet
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
