import React, { useEffect } from 'react'
import {
  ActionType,
  GlobalProvider,
  ThemeState,
  useLadleContext
} from '@ladle/react'
import { Box } from '@palladxyz/ui'
import { theme, ThemeProvider } from '../src'
import { NativeRouter } from 'react-router-native'

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <NativeRouter>
        <Box css={{ width: 400, height: 600, backgroundColor: '$gray900' }}>
          {children}
        </Box>
      </NativeRouter>
    </ThemeProvider>
  )
}
