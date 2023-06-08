import '@/assets/app.css'
import { useState } from 'react'
import { RouterProvider, createMemoryHistory } from '@tanstack/router'
import { router } from './Router'
import { ThemeProvider, theme } from '@palladxyz/ui'
import { trpc } from './lib/trpc'

function App() {
  const history = createMemoryHistory()
  const [client] = useState(() => trpc.createClient())
  return (
    <trpc.Provider client={client}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} history={history} />
      </ThemeProvider>
    </trpc.Provider>
  )
}

export default App
