import 'dotenv/config'
import '@total-typescript/ts-reset'
import '@palladxyz/features/dist/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { WebConnector } from '@palladxyz/features'
import { ThemeProvider } from 'next-themes'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WebConnector />
    </ThemeProvider>
  </React.StrictMode>
)
