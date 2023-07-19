import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@palladxyz/ui'
import {
  ArrowRightLeftIcon,
  BookIcon,
  CoinsIcon,
  InfoIcon,
  LayoutDashboardIcon,
  ListIcon,
  ReplaceIcon,
  SettingsIcon
} from 'lucide-react'
import React from 'react'

export const CommandMenu = () => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem>
            <LayoutDashboardIcon className="mr-2" />
            Dashboard
          </CommandItem>
          <CommandItem>
            <BookIcon className="mr-2" />
            Address Book
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Transactions">
          <CommandItem>
            <ArrowRightLeftIcon className="mr-2" />
            New Transaction
          </CommandItem>
          <CommandItem>
            <ListIcon className="mr-2" />
            Transactions
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Staking">
          <CommandItem>
            <CoinsIcon className="mr-2" />
            Staking
          </CommandItem>
          <CommandItem>
            <ReplaceIcon className="mr-2" />
            Change delegation
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Menu">
          <CommandItem>
            <SettingsIcon className="mr-2" />
            Settings
          </CommandItem>
          <CommandItem>
            <InfoIcon className="mr-2" />
            About
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
