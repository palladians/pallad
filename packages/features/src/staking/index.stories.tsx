import { type Story, type StoryDefault, action } from "@ladle/react"

import { BlockProducersView } from "./views/block-producers"
import { DelegateView } from "./views/delegate"
import { StakingOverviewView } from "./views/staking-overview"

export const Overview: Story<{ stakeDelegated: boolean }> = ({
  stakeDelegated,
}) => (
  <StakingOverviewView
    stakeDelegated={stakeDelegated}
    onChangePool={action("Change Pool")}
  />
)

export const Delegate: Story<{ advanced: boolean }> = ({ advanced }) => (
  <DelegateView
    onGoBack={() => console.log("go back")}
    advanced={advanced}
    setAdvanced={action("Toggle Advanced")}
  />
)

export const Producers = () => (
  <BlockProducersView
    blockProducers={[
      { name: "Test", delegatorsCount: 5, publicKey: "B62Test", stake: 442 },
    ]}
    onGoBack={() => console.log("go back")}
  />
)

export default {
  title: "Staking",
  args: {
    stakeDelegated: false,
    advanced: false,
  },
} satisfies StoryDefault
