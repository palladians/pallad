import type { Story, StoryDefault } from "@ladle/react"

import { StakingOverviewView } from "./staking-overview"

export const View: Story<{ stakeDelegated: boolean }> = ({
  stakeDelegated,
}) => <StakingOverviewView stakeDelegated={stakeDelegated} />

export default {
  title: "Staking / Overview",
  args: {
    stakeDelegated: false,
  },
} satisfies StoryDefault
