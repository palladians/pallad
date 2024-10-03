import { useTranslation } from "react-i18next"

import type { useAccount } from "@/common/hooks/use-account"
import { AddressDropdown } from "@/components/address-dropdown"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"

import { Link } from "react-router-dom"
import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts"

type EmptyStateProps = {
  heading: React.ReactNode
  button: {
    label: string
    url: string
    testId: string
  }
}

const EmptyState = ({ heading, button }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {heading}
      <Link
        to={button.url}
        className="btn btn-primary max-w-[140px] w-full"
        data-testid={button.testId}
      >
        {button.label}
      </Link>
    </div>
  )
}

type StakingOverviewViewProps = {
  stakeDelegated: boolean
  account: ReturnType<typeof useAccount>
  rewards: { amount: number }[]
  stats: { lastReward: number; avgReward: number; totalReward: number }
}

export const StakingOverviewView = ({
  stakeDelegated,
  account,
  rewards,
  stats,
}: StakingOverviewViewProps) => (
  <AppLayout>
    <div className="card flex-col bg-secondary rounded-t-none pb-6">
      <MenuBar variant="dashboard" />
      <div className="flex flex-col gap-6 px-8">
        <h1 className="text-3xl">{useTranslation().t("staking")}</h1>
        {stakeDelegated ? (
          <div className="flex flex-row justify-between items-center card bg-neutral p-6">
            <div className="flex flex-col">
              <AddressDropdown
                publicKey={
                  account?.currentWallet.accountInfo?.MINA?.delegate ?? ""
                }
                className="before:ml-16"
              />
            </div>
            <Link
              to="/staking/delegate"
              className="btn btn-primary px-7"
              data-testid="staking/start"
            >
              {useTranslation().t("edit")}
            </Link>
          </div>
        ) : (
          <EmptyState
            heading={
              <h2 className="text-lg">
                {useTranslation().t("enjoy-seamless")}
              </h2>
            }
            button={{
              label: "Stake",
              url: "/staking/delegate",
              testId: "staking/start",
            }}
          />
        )}
      </div>
    </div>
    <div className="flex flex-1 justify-between flex-col px-8 pt-8 gap-4">
      <h2 className="text-2xl">{useTranslation().t("block-rewards")}</h2>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center flex-col">
          <p className="text-2xl">{stats.lastReward}</p>
          <h3 className="text-sm">{useTranslation().t("last-reward")}</h3>
        </div>
        <div className="flex justify-center items-center flex-col">
          <p className="text-2xl">{stats.avgReward}</p>
          <h3 className="text-sm">{useTranslation().t("avg-reward")}</h3>
        </div>
        <div className="flex justify-center items-center flex-col">
          <p className="text-2xl">{stats.totalReward}</p>
          <h3 className="text-sm">{useTranslation().t("total-reward")}</h3>
        </div>
      </div>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <BarChart
          data={rewards}
          margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
        >
          <Tooltip
            cursor={false}
            wrapperClassName="card"
            contentStyle={{
              background: "#413E5E",
              borderColor: "#25233A",
              borderWidth: "2px",
            }}
          />
          <Bar
            dataKey="amount"
            fill="#A3DBE4"
            radius={[32, 32, 0, 0]}
            background={{ fill: "#25233A", radius: 32 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </AppLayout>
)
