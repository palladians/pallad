import React from "react"

import { useAccount } from "@/common/hooks/use-account"

import { BottomNavigation } from "./bottom-navigation"
import { CommandMenu } from "./command-menu"

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { lockWallet } = useAccount()
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false)
  const openCommandMenu = () => setCommandMenuOpen(true)
  return (
    <div
      className="flex flex-col flex-1 bg-background gap-4"
      data-testid="appLayout"
    >
      <CommandMenu
        open={commandMenuOpen}
        setOpen={setCommandMenuOpen}
        lockWallet={lockWallet}
      />
      <div className="animate-in fade-in flex flex-1">{children}</div>
      <BottomNavigation openCommandMenu={openCommandMenu} />
    </div>
  )
}
