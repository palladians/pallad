import type { StoryDefault } from "@ladle/react"

import { OverviewView } from "./overview"

export const View = () => {
  return (
    <OverviewView account={{ publicKey: "B62XXX" } as any} fiatBalance={1337} />
  )
}

export default {
  title: "Dashboard / Overview",
} satisfies StoryDefault
