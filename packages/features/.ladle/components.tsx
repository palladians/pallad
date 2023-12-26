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
          <div
            style={{
              maxWidth: 371,
              width: '100%',
              maxHeight: 600,
              height: '100%',
              display: 'flex',
              overflowX: 'hidden',
              overflowY: 'scroll'
            }}
          >
            {children}
            <Toaster />
          </div>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}
