import "@palladco/features/dist/index.css"
import "@total-typescript/ts-reset"

import { WebConnectorRoute } from "@palladco/features"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WebConnectorRoute />
    </ThemeProvider>
  </React.StrictMode>,
)
