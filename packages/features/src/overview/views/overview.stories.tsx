import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { OverviewView } from "./overview"

export const View = () => {
  return (
    <OverviewView
      account={{ publicKey: "B62XXX" } as any}
      fiatBalance={1337}
      onSend={action("Send Clicked")}
      onReceive={action("Receive Clicked")}
    />
  )
}

export default {
  title: "Dashboard",
} satisfies StoryDefault
