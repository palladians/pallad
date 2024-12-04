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
import { I18nextProvider } from "react-i18next"
import { MemoryRouter } from "react-router-dom"
import { i18n } from "../src/lib/i18n"

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  // biome-ignore lint: first render
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  )
}
