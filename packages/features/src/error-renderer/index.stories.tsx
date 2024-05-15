import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"
import { ErrorView } from "./views/error"

export const RuntimeError = () => (
  <ErrorView
    error={new Error("Unexpected behavior.")}
    resetErrorBoundary={action("Reset Boundary")}
  />
)

export default {
  title: "Error Renderer",
} satisfies StoryDefault
