import { useAccount } from "@/common/hooks/use-account"

import { useTransactions } from "@/common/hooks/use-transactions"
import { mean, sum } from "rambda"
import { StakingOverviewView } from "../views/staking-overview"

export const StakingOverviewRoute = () => {
  const account = useAccount()
  const { accountInfo } = account.currentWallet
  const { data: transactions } = useTransactions()
  const rewardsTransactions = transactions
    ?.filter(
      (tx) =>
        tx.from === accountInfo.MINA.delegate &&
        tx.to === accountInfo.MINA.publicKey,
    )
    .filter((tx) => tx.from !== accountInfo.MINA.publicKey)
  const rewards = Array(6)
    .fill({ amount: 0 })
    .map((_, i) => ({
      amount:
        Number.parseFloat(
          rewardsTransactions?.[i]?.amount?.toString() ?? "0",
        ) ?? 0,
    }))
  return (
    <StakingOverviewView
      account={account}
      rewards={rewards}
      stakeDelegated={account.stakeDelegated}
      stats={{
        lastReward:
          Number.parseFloat(
            rewardsTransactions?.[0]?.amount?.toString() ?? "0",
          ) ?? 0,
        avgReward:
          mean(
            rewardsTransactions?.map((tx) =>
              Number.parseFloat(tx?.amount?.toString() ?? "0"),
            ) ?? [],
          ) ?? 0,
        totalReward:
          sum(
            rewardsTransactions?.map((tx) =>
              Number.parseFloat(tx?.amount?.toString() ?? "0"),
            ) ?? [],
          ) ?? 0,
      }}
    />
  )
}
