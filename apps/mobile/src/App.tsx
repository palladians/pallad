import './assets/app.css'

import { StatusBar, Style } from '@capacitor/status-bar'
import { Router, theme, ThemeProvider } from '@palladxyz/features'
import { Box } from '@palladxyz/ui'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // screen?.orientation?.lock('portrait-primary')
    StatusBar.setStyle({ style: Style.Dark })
  }, [])
  return (
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
  )
}

export default App
