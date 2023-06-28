import { Box } from '@palladxyz/ui'
import React from 'react'

import { BottomNavigation } from './BottomNavigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <Box css={{ flex: 1, backgroundColor: '$background' }}>
      <Box css={{ flex: 1 }}>{children}</Box>
      <BottomNavigation />
    </Box>
  )
}
