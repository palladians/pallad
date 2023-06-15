import { Box } from '@palladxyz/ui'
import React from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '../store/app'
import { MenuModal } from './MenuModal'
import { Navbar } from './Navbar'
import { BottomNavigation } from './BottomNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { menuOpen, setMenuOpen } = useAppStore(
    (state) => ({ menuOpen: state.menuOpen, setMenuOpen: state.setMenuOpen }),
    shallow
  )
  return (
    <Box css={{ flex: 1, backgroundColor: '$background' }}>
      <MenuModal isOpen={menuOpen} setIsOpen={setMenuOpen} />
      {children}
      <BottomNavigation />
    </Box>
  )
}
