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
      {
        name: "Test",
        delegators: 5,
        pk: "B62qj287L1bwP9XguURbxW5cneTRD8Kde4vx3fbeZCNxNxyMzXdsYLP",
        amountStaked: 442,
        img: "https://pallad.co/logo.svg",
      },
      {
        delegators: 212,
        pk: "B62qj287L1bwP9XguURbxW5cneTRD8Kde4vx3fbeZCNxNxyMzXdsYLX",
        amountStaked: 333,
        img: "https://pallad.co/logo.svg",
      },
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
