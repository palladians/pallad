import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { NetworksView } from "./views/networks"
import { OverviewView } from "./views/overview"

export const Dashboard = () => {
  return (
    <OverviewView
      lastMonthPrices={[]}
      balance={1337}
      chartLabel="test"
      loading={false}
      currentPriceIndex={undefined}
      setCurrentPriceIndex={action("Set Current Price Index")}
      transactions={[]}
      publicAddress="B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"
      onSend={action("Send Clicked")}
      onReceive={action("Receive Clicked")}
    />
  )
}

export const Networks = () => {
  return <NetworksView currentNetwork="Berkeley" />
}

export default {
  title: "Wallet",
} satisfies StoryDefault
