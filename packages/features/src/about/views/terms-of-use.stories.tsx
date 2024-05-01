import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { TermsOfUseView } from "./terms-of-use"

export const View = () => <TermsOfUseView onCloseClicked={action("Go Back")} />

export default {
  title: "Settings / About / Terms of use",
} satisfies StoryDefault
