import "@palladco/features/dist/index.css"
import "./assets/app.css"

import { Router } from "@palladco/features"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    if (typeof document === "undefined") return
    const handleContextmenu = (e: MouseEvent) => {
      if (!e.metaKey) e.preventDefault()
    }
    document.addEventListener("contextmenu", handleContextmenu)
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router />
    </ThemeProvider>
  )
}

export default App
