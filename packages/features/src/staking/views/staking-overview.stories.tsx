import { StoryDefault } from '@ladle/react'

import { StakingOverviewView } from './staking-overview'

export const View = () => <StakingOverviewView stakeDelegated={false} />

export default {
  title: 'Dashboard / Staking'
} satisfies StoryDefault
