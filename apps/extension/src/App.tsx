import './assets/app.css'
import '@palladxyz/ui/dist/index.css'

import { Router } from '@palladxyz/features'
import { ThemeProvider } from 'next-themes'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router />
    </ThemeProvider>
  )
}

export default App
