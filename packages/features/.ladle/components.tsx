import '@/globals.css'
import { useEffect } from 'react'
import {
  ActionType,
  GlobalProvider,
  ThemeState,
  useLadleContext
} from '@ladle/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <MemoryRouter>
          {children}
          <Toaster />
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}
