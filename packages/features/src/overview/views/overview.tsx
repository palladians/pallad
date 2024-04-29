import ArrowRightIcon from "@/common/assets/arrow-right.svg?react"
import IncomingIcon from "@/common/assets/incoming.svg?react"
import Logo from "@/common/assets/logo.svg?react"
import type { useAccount } from "@/common/hooks/use-account"
import { DashboardMenuBar } from "@/components/dashboard-menu-bar"
import { MenuBar } from "@/components/menu-bar"
import { ChevronRightIcon } from "lucide-react"
import { MenuDrawer } from "../components/menu-drawer"
import { PortfolioValueChart } from "../components/portfolio-value-chart"

const TxTile = () => (
  <div className="card bg-secondary p-4 aspect-square grid-col gap-1">
    <div className="btn btn-circle bg-neutral">
      <IncomingIcon />
    </div>
    <h3 className="mt-2">Mina</h3>
    <p>1,000.0982</p>
  </div>
)

type OverviewViewProps = {
  account: ReturnType<typeof useAccount>
  fiatBalance: number
  onSend: () => void
  onReceive: () => void
}

export const OverviewView = ({
  account,
  fiatBalance,
  onSend,
  onReceive,
}: OverviewViewProps) => {
  return (
    <div className="flex flex-col flex-1">
      {/* {account.isLoading ? (
        <div className="skeleton w-full h-[182px]" />
      ) : (
        <OverviewCard account={account} fiatBalance={fiatBalance} />
      )}
      <AssetList account={account} /> */}
      <DashboardMenuBar />
      <PortfolioValueChart />
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <h1 className="text-primary">Portfolio value</h1>
        <h2>
          <span className="text-6xl">$10,476</span>
          <span className="text-lg">.48</span>
        </h2>
        <p className="text-mint">+254.58 (24h)</p>
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={onSend}
          >
            Send
          </button>
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={onReceive}
          >
            Receive
          </button>
        </div>
      </div>
      <div className="flex flex-col px-8 py-4 gap-3 pb-16">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-mint">Recent</p>
            <h2 className="text-xl">Transactions</h2>
          </div>
          <button type="button" className="flex items-center mb-[2px]">
            <span>See all</span>
            <ArrowRightIcon />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TxTile />
          <TxTile />
        </div>
      </div>
    </div>
  )
}
