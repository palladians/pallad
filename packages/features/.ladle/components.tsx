import React, { useEffect } from 'react'
import {
  ActionType,
  GlobalProvider,
  ThemeState,
  useLadleContext
} from '@ladle/react'
import { MemoryRouter } from 'react-router-dom'
import '@palladxyz/ui/dist/index.css'

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <MemoryRouter>
      <div className="w-400 h-600 bg-sky-950">{children}</div>
    </MemoryRouter>
  )
}
