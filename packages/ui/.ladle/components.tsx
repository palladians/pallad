import React from 'react'
import { GlobalProvider } from '@ladle/react'
import { theme, ThemeProvider } from '../src/lib/styled'

export const Provider: GlobalProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
