import "@/globals.css"
import {
  ActionType,
  type GlobalProvider,
  ThemeState,
  useLadleContext,
} from "@ladle/react"
import { ThemeProvider } from "next-themes"
import React, { useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { MemoryRouter } from "react-router-dom"

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  // biome-ignore lint: first render
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MemoryRouter>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <div>
              {JSON.stringify(error, Object.getOwnPropertyNames(error))}
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      </MemoryRouter>
    </ThemeProvider>
  )
}
