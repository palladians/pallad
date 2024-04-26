import type { StoryDefault } from "@ladle/react"

import { SettingsView } from "./settings"

export const View = () => (
  <SettingsView
    network="berkeley"
    onGoBack={() => console.log("go back")}
    restartAlertVisible={false}
    setRestartAlertVisible={(visible) => console.log({ visible })}
    setShareData={(shareData) => console.log({ shareData })}
    setTheme={(theme) => console.log({ theme })}
    shareData={false}
    theme="dark"
  />
)

export default {
  title: "Dashboard / Settings",
} satisfies StoryDefault
