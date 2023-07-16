import { useEffect } from 'react'
import {
  ActionType,
  GlobalProvider,
  ThemeState,
  useLadleContext
} from '@ladle/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import '@palladxyz/ui/dist/index.css'

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MemoryRouter>
        <div style={{ width: 400, height: 600, display: 'flex' }}>
          {children}
        </div>
      </MemoryRouter>
    </ThemeProvider>
  )
}
