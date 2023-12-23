import './assets/app.css'
import '@palladxyz/features/dist/index.css'

import { Router } from '@palladxyz/features'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      if (!e.metaKey) e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
      document.removeEventListener('contextmenu', handleContextmenu)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router />
    </ThemeProvider>
  )
}

export default App
