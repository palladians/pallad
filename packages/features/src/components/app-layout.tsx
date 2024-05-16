import { install } from "@github/hotkey"
import type React from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation()
  // biome-ignore lint: dependent just on location
  useEffect(() => {
    for (const el of document.querySelectorAll("[data-hotkey]")) {
      install(el as never)
    }
  }, [location])
  return (
    <div className="flex flex-col flex-1 bg-background" data-testid="appLayout">
      {children}
    </div>
  )
}
