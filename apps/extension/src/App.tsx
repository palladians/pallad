import './assets/app.css'

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
