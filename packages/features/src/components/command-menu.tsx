import {
  ArrowRightLeftIcon,
  BookIcon,
  CoinsIcon,
  InfoIcon,
  LayoutDashboardIcon,
  ListIcon,
  LockIcon,
  QrCodeIcon,
  ReplaceIcon,
  SettingsIcon,
} from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  lockWallet: () => void
}

export const CommandMenu = ({
  open,
  setOpen,
  lockWallet,
}: CommandMenuProps) => {
  const navigate = useNavigate()

  const COMMAND_GROUPS = [
    {
      name: "General",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboardIcon,
          onSelect: () => navigate("/dashboard"),
          testId: "commandMenu__dashboard",
        },
        {
          name: "Receive",
          icon: QrCodeIcon,
          onSelect: () => navigate("/receive"),
          testId: "commandMenu__receive",
        },
        {
          name: "Address Book",
          icon: BookIcon,
          onSelect: () => navigate("/contacts"),
          testId: "commandMenu__addressBook",
        },
      ],
    },
    {
      name: "Transactions",
      items: [
        {
          name: "Transactions",
          icon: ListIcon,
          onSelect: () => navigate("/transactions"),
          testId: "commandMenu__transactions",
        },
        {
          name: "New Transaction",
          icon: ArrowRightLeftIcon,
          onSelect: () => navigate("/send"),
          testId: "commandMenu__send",
        },
      ],
    },
    {
      name: "Staking",
      items: [
        {
          name: "Staking",
          icon: CoinsIcon,
          onSelect: () => navigate("/staking"),
          testId: "commandMenu__staking",
        },
        {
          name: "Change Delegation",
          icon: ReplaceIcon,
          onSelect: () => navigate("/staking/delegate"),
          testId: "commandMenu__delegate",
        },
      ],
    },
    {
      name: "Wallet",
      items: [
        {
          name: "Settings",
          icon: SettingsIcon,
          onSelect: () => navigate("/settings"),
          testId: "commandMenu__settings",
        },
        {
          name: "About",
          icon: InfoIcon,
          onSelect: () => navigate("/about"),
          testId: "commandMenu__about",
        },
        {
          name: "Lock Wallet",
          icon: LockIcon,
          onSelect: lockWallet,
          testId: "commandMenu__lockWallet",
        },
      ],
    },
  ]

  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && e.metaKey) {
      setOpen(!open)
    }
  }

  // biome-ignore lint: only add listeners on first render
  React.useEffect(() => {
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {COMMAND_GROUPS.map((group, i) => (
          // biome-ignore lint: array won't update
          <CommandGroup key={i} heading={group.name}>
            {group.items.map((item, j) => (
              <CommandItem
                // biome-ignore lint: won't update
                key={j}
                onSelect={() => {
                  item.onSelect()
                  setOpen(false)
                }}
                data-testid={item.testId}
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
