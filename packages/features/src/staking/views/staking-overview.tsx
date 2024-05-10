import type { useAccount } from "@/common/hooks/use-account"
import type { useBlockchainSummary } from "@/common/hooks/use-blockchain-summary"
import { truncateString } from "@/common/lib/string"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"

import { Link } from "react-router-dom"

type EmptyStateProps = {
  heading: React.ReactNode
  button: {
    label: string
    url: string
  }
}

const EmptyState = ({ heading, button }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {heading}
      <Link to={button.url} className="btn btn-primary max-w-[140px] w-full">
        {button.label}
      </Link>
    </div>
  )
}

type StakingOverviewViewProps = {
  stakeDelegated: boolean
  onChangePool: () => void
  blockchainSummary: ReturnType<typeof useBlockchainSummary>
  account: ReturnType<typeof useAccount>
}

export const StakingOverviewView = ({
  stakeDelegated,
  onChangePool,
  account,
}: StakingOverviewViewProps) => (
  <AppLayout>
    <div className="card flex-col bg-secondary rounded-t-none pb-6">
      <MenuBar variant="dashboard" />
      <div className="flex flex-col gap-6 px-8">
        <h1 className="text-3xl">Staking</h1>
        {stakeDelegated ? (
          <div className="flex flex-row justify-between card bg-neutral p-6">
            <div className="flex flex-col">
              <p>
                {truncateString({
                  value: account?.accountInfo?.MINA?.delegate ?? "",
                  firstCharCount: 5,
                  endCharCount: 3,
                })}
              </p>
            </div>
            <Link to="/staking/delegate" className="btn btn-primary px-7">
              Edit
            </Link>
          </div>
        ) : (
          <EmptyState
            heading={
              <h2 className="text-lg">
                Enjoy non-custodial staking and earn up to 6.5% APY
              </h2>
            }
            button={{
              label: "Stake",
              url: "/staking/delegate",
            }}
          />
        )}
      </div>
    </div>
  </AppLayout>
)
