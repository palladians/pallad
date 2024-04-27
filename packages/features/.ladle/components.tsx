import "@/globals.css"
import {
  ActionType,
  type GlobalProvider,
  ThemeState,
  useLadleContext,
} from "@ladle/react"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"
import { MemoryRouter } from "react-router-dom"

export const Provider: GlobalProvider = ({ children }) => {
  const { dispatch } = useLadleContext()
  // biome-ignore lint: first render
  useEffect(() => {
    dispatch({ type: ActionType.UpdateTheme, value: ThemeState.Dark })
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MemoryRouter>{children}</MemoryRouter>
    </ThemeProvider>
  )
}
