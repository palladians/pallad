import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { AboutView } from "./about"

export const View = () => <AboutView onGoBack={action("Go Back")} />

export default {
  title: "About",
} satisfies StoryDefault
