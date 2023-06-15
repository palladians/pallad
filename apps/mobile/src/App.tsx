import './assets/app.css'

import { StatusBar, Style } from '@capacitor/status-bar'
import { Router, theme, ThemeProvider, trpc } from '@palladxyz/features'
import { Box } from '@palladxyz/ui'
import { useEffect, useState } from 'react'

function App() {
  const [client] = useState(() => trpc.createClient())
  useEffect(() => {
    // screen?.orientation?.lock('portrait-primary')
    StatusBar.setStyle({ style: Style.Dark })
  }, [])
  return (
    <trpc.Provider client={client}>
      <ThemeProvider theme={theme}>
        <Box
          css={{
            minHeight: '100vh',
            paddingTop: 'var(--safe-area-inset-top)',
            paddingBottom: 'var(--safe-area-inset-bottom)',
            backgroundColor: '$gray900'
          }}
        >
          <Router />
        </Box>
      </ThemeProvider>
    </trpc.Provider>
  )
}

export default App
