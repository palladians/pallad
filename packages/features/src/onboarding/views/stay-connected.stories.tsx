import type { StoryDefault } from "@ladle/react"

import { StayConnectedView } from "./stay-connected"

export const View = () => (
  <StayConnectedView onGoToDashboard={() => console.log("dashboard")} />
)

export default {
  title: "Onboarding / Stay Connected",
} satisfies StoryDefault
