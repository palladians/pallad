import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { AboutView } from "./about"

export const View = () => <AboutView onCloseClicked={action("Go Back")} />

export default {
  title: "Settings / About",
} satisfies StoryDefault
