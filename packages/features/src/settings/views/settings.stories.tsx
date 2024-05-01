import type { StoryDefault } from "@ladle/react"

import { SettingsView } from "./settings"

export const View = () => (
  <SettingsView
    onCloseClicked={() => console.log("go back")}
    onDonateClicked={() => console.log("donate")}
  />
)

export default {
  title: "Settings",
} satisfies StoryDefault
