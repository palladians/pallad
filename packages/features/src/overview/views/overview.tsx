import ArrowRightIcon from "@/common/assets/arrow-right.svg?react"
import IncomingIcon from "@/common/assets/incoming.svg?react"
import type { useAccount } from "@/common/hooks/use-account"
import { MenuBar } from "@/components/menu-bar"
import { Skeleton } from "@/components/skeleton"
import { Link } from "react-router-dom"
import SlotCounter from "react-slot-counter"
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
  lastMonthPrices: [number, number][]
  balance: number
  chartLabel: string
  loading: boolean
  currentPriceIndex: number | undefined
  setCurrentPriceIndex: (currentPriceIndex: number | undefined) => void
  onSend: () => void
  onReceive: () => void
}

export const OverviewView = ({
  lastMonthPrices,
  balance,
  chartLabel,
  loading,
  currentPriceIndex,
  setCurrentPriceIndex,
  onSend,
  onReceive,
}: OverviewViewProps) => {
  const [bucks, cents] = balance.toFixed(2).toString().split(".")
  return (
    <div className="flex flex-col flex-1">
      <MenuBar variant="dashboard" />
      <Skeleton loading={loading} h="62px">
        <PortfolioValueChart
          lastMonthPrices={lastMonthPrices}
          setCurrentPriceIndex={setCurrentPriceIndex}
          currentPriceIndex={currentPriceIndex}
        />
      </Skeleton>
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <h1 className="text-primary">Portfolio value</h1>
        <Skeleton loading={loading} h="65px">
          <h2 className="flex items-end">
            <span className="flex items-center text-6xl">
              <span>$</span>
              <SlotCounter
                startValue={0}
                value={bucks}
                charClassName="font-work-sans"
              />
            </span>
            <span className="flex items-end text-lg">
              <span>.</span>
              <SlotCounter
                startValue="00"
                value={cents}
                charClassName="font-work-sans"
              />
            </span>
          </h2>
        </Skeleton>
        <Skeleton loading={loading} h="24px">
          <p className="text-mint">{chartLabel}</p>
        </Skeleton>
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
          <Link to="/transactions" className="flex items-center mb-[2px]">
            <span>See all</span>
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TxTile />
          <TxTile />
        </div>
      </div>
    </div>
  )
}
