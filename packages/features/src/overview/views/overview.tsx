import ArrowRightIcon from "@/common/assets/arrow-right.svg?react"
import IncomingIcon from "@/common/assets/incoming.svg?react"
import Logo from "@/common/assets/logo.svg?react"
import MenuIcon from "@/common/assets/menu.svg?react"
import type { useAccount } from "@/common/hooks/use-account"
import { MenuBar } from "@/components/menu-bar"
import { ChevronRightIcon } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const TxTile = () => (
  <div className="card bg-secondary p-4 aspect-square grid-col gap-1">
    <div className="btn btn-circle bg-neutral">
      <IncomingIcon />
    </div>
    <h3 className="mt-2">Mina</h3>
    <p>1,000.0982</p>
  </div>
)

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

type OverviewViewProps = {
  account: ReturnType<typeof useAccount>
  fiatBalance: number
}

export const OverviewView = ({ account, fiatBalance }: OverviewViewProps) => {
  return (
    <div className="flex flex-col flex-1">
      {/* {account.isLoading ? (
        <div className="skeleton w-full h-[182px]" />
      ) : (
        <OverviewCard account={account} fiatBalance={fiatBalance} />
      )}
      <AssetList account={account} /> */}
      <MenuBar
        leftSlot={<Logo width={32} height={32} />}
        rightSlot={
          <button type="button" className="btn btn-circle">
            <MenuIcon />
          </button>
        }
      >
        <button type="button" className="btn flex gap-1">
          <span>B62qq...B7S</span>
          <ChevronRightIcon />
        </button>
      </MenuBar>
      <ResponsiveContainer width="100%" aspect={6}>
        <AreaChart
          width={300}
          height={100}
          data={data}
          margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
        >
          <Area
            type="linear"
            dataKey="pv"
            stroke="#25233A"
            fill="#25233A"
            dot={false}
            fillOpacity={1}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <h1 className="text-primary">Portfolio value</h1>
        <h2>
          <span className="text-6xl">$10,476</span>
          <span className="text-lg">.48</span>
        </h2>
        <p className="text-mint">+254.58 (24h)</p>
        <div className="flex gap-4">
          <button type="button" className="flex-1 btn btn-primary">
            Send
          </button>
          <button type="button" className="flex-1 btn btn-primary">
            Receive
          </button>
        </div>
      </div>
      <div className="flex flex-col px-8 py-4 gap-3">
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
