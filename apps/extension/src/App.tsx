import './assets/app.css'

import { Router, theme, ThemeProvider } from '@palladxyz/features'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}

export default App
