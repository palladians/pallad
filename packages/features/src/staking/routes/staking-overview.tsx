import { useAccount } from "@/common/hooks/use-account"

import { useTransactions } from "@/common/hooks/use-transactions"
import { mean, sum } from "rambda"
import { StakingOverviewView } from "../views/staking-overview"

export const StakingOverviewRoute = () => {
  const account = useAccount()
  const { data: transactions } = useTransactions()
  const rewardsTransactions = transactions?.filter(
    (tx) =>
      tx.from === account.accountInfo.MINA.delegate &&
      tx.to === account.accountInfo.MINA.publicKey,
  )
  const rewards = Array(6)
    .fill({ amount: 0 })
    .map((_, i) => ({ amount: rewardsTransactions?.[i]?.amount ?? 0 }))
  return (
    <StakingOverviewView
      account={account}
      rewards={rewards}
      stakeDelegated={account.stakeDelegated}
      stats={{
        lastReward: rewardsTransactions[0]?.amount ?? 0,
        avgReward: mean(rewardsTransactions.map((tx) => tx?.amount)) || 0,
        totalReward: sum(rewardsTransactions.map((tx) => tx?.amount)),
      }}
    />
  )
}
