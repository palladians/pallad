import '@/assets/app.css'
import { RouterProvider, createMemoryHistory } from '@tanstack/router'
import { router } from './Router'
import { ThemeProvider, theme } from './lib/styled'

function App() {
  const history = createMemoryHistory()
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} history={history} />
    </ThemeProvider>
  )
}

export default App
