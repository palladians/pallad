'use client'
import { Box } from '@palladxyz/ui'
import React from 'react'

import { Navbar } from '@/app/Navbar'

interface LandingLayoutProps {
  children: React.ReactNode
}

export const LandingLayout = ({ children }: LandingLayoutProps) => {
  return (
    <Box css={{ minHeight: '100vh' }}>
      <Navbar />
      <Box
        css={{
          flex: 1,
          backgroundImage: 'url(/mesh.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
