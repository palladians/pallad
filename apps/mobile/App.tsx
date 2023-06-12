import { Router, theme, ThemeProvider, trpc } from '@palladxyz/features'
import { useState } from 'react'

function App() {
  const [client] = useState(() => trpc.createClient())
  return (
    <trpc.Provider client={client}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </trpc.Provider>
  )
}

export default App
