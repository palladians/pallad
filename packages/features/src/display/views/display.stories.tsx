import type { StoryDefault } from "@ladle/react"
import { DisplayView } from "../views/display"

export const View = () => (
  <DisplayView onCloseClicked={() => console.log("Go Back")} />
)

export default {
  title: "Settings / Display",
} satisfies StoryDefault
