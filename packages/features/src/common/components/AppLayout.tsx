import { Box } from '@palladxyz/ui'
import React from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '../store/app'
import { BottomNavigation } from './BottomNavigation'
import { MenuModal } from './MenuModal'

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
      <Box css={{ flex: 1 }}>{children}</Box>
      <BottomNavigation />
    </Box>
  )
}
