import { Box } from '@palladxyz/ui'
import React from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '../store/app'
import { MenuModal } from './MenuModal'
import { Navbar } from './Navbar'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { menuOpen, setMenuOpen } = useAppStore(
    (state) => ({ menuOpen: state.menuOpen, setMenuOpen: state.setMenuOpen }),
    shallow
  )
  return (
    <Box>
      <MenuModal isOpen={menuOpen} setIsOpen={setMenuOpen} />
      <Navbar />
      {children}
    </Box>
  )
}
