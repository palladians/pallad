import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { NetworksView } from "./views/networks"
import { OverviewView } from "./views/overview"

export const Dashboard = () => {
  return (
    <OverviewView
      lastMonthPrices={[]}
      chartLabel="test"
      loading={false}
      currentPriceIndex={undefined}
      setCurrentPriceIndex={action("Set Current Price Index")}
      transactions={[]}
      publicAddress="B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS"
      onSend={action("Send Clicked")}
      onReceive={action("Receive Clicked")}
      fiatBalance={100}
      minaBalance={200}
      setUseFiatBalance={action("Set Use Fiat Balance")}
      useFiatBalance={true}
    />
  )
}

export const Networks = () => {
  return (
    <NetworksView
      networkId="mina:devnet"
      onCloseClicked={action("Close")}
      onNetworkSwitch={() => Promise.resolve(action("Switch")())}
    />
  )
}

export default {
  title: "Wallet",
} satisfies StoryDefault
