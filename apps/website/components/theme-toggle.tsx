'use client'

import { Button } from '@palladxyz/ui'
import { MoonStarIcon, SunDimIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunDimIcon className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <MoonStarIcon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
