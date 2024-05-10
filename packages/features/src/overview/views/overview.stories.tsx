import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { OverviewView } from "./overview"

export const View = () => {
  return (
    <OverviewView
      lastMonthPrices={[]}
      balance={1337}
      chartLabel="test"
      loading={false}
      currentPriceIndex={undefined}
      setCurrentPriceIndex={action("Set Current Price Index")}
      onSend={action("Send Clicked")}
      onReceive={action("Receive Clicked")}
    />
  )
}

export default {
  title: "Dashboard",
} satisfies StoryDefault
