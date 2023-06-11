import './assets/app.css'

import { Router, trpc } from '@palladxyz/features'
import { theme, ThemeProvider } from '@palladxyz/ui'
import { useState } from 'react'
import { SWRConfig } from 'swr'

function App() {
  const [client] = useState(() => trpc.createClient())
  return (
    <SWRConfig>
      <trpc.Provider client={client}>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </trpc.Provider>
    </SWRConfig>
  )
}

export default App
