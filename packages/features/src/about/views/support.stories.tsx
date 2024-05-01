import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { SupportView } from "./support"

export const View = () => <SupportView onCloseClicked={action("Go Back")} />

export default {
  title: "Settings / About / Support",
} satisfies StoryDefault
