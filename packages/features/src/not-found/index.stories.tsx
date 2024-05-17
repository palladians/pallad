import type { StoryDefault } from "@ladle/react"

import { NotFoundView } from "./views/not-found"

export const NotFound = () => (
  <NotFoundView
    onGoBack={() => console.log("go back")}
    onGoToDashboard={() => console.log("go to dash")}
  />
)

export default {
  title: "Not Found",
} satisfies StoryDefault
