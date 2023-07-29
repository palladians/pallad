import React from 'react'

import { BottomNavigation } from './BottomNavigation'
import { CommandMenu } from './CommandMenu'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false)
  const openCommandMenu = () => setCommandMenuOpen(true)
  return (
    <div className="flex flex-col flex-1 dark:bg-slate-950 bg-white p-4 gap-4 max-h-[600px]">
      <CommandMenu open={commandMenuOpen} setOpen={setCommandMenuOpen} />
      <div className="flex flex-1">{children}</div>
      <BottomNavigation openCommandMenu={openCommandMenu} />
    </div>
  )
}
