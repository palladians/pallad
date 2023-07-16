import React from 'react'

import { BottomNavigation } from './BottomNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex-1 bg-sky-950">
      <div className="flex-1">{children}</div>
      <BottomNavigation />
    </div>
  )
}
