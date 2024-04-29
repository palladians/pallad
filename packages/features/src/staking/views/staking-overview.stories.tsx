import type { StoryDefault } from "@ladle/react"

import { StakingOverviewView } from "./staking-overview"

export const View = () => <StakingOverviewView stakeDelegated={false} />

export default {
  title: "Staking / Overview",
} satisfies StoryDefault
