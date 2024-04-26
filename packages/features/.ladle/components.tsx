import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
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
      <TooltipProvider>
        <MemoryRouter>
          <div
            style={{
              maxWidth: 371,
              width: "100%",
              maxHeight: 600,
              height: "100%",
              display: "flex",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
            {children}
            <Toaster />
          </div>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}
