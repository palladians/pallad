import React from 'react'

import { BottomNavigation } from './BottomNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex flex-col flex-1 dark:bg-slate-950 bg-white p-4 gap-4 max-h-[600px]">
      <div className="flex flex-1">{children}</div>
      <BottomNavigation />
    </div>
  )
}
