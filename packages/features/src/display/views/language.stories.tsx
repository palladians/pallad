import type { StoryDefault } from "@ladle/react"
import { LanguageView } from "./language"

export const View = () => (
  <LanguageView onCloseClicked={() => console.log("Go Back")} />
)

export default {
  title: "Settings / Display / Language",
} satisfies StoryDefault
