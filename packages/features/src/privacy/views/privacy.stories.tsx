import type { StoryDefault } from "@ladle/react"
import { PrivacyView } from "./privacy"

export const View = () => (
  <PrivacyView onCloseClicked={() => console.log("Go Back")} />
)

export default {
  title: "Settings / Privacy",
} satisfies StoryDefault
