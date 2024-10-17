import ArrowRightIcon from "@/common/assets/arrow-right.svg?react"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { Skeleton } from "@/components/skeleton"
import type { Tx } from "@palladxyz/pallad-core"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import SlotCounter from "react-slot-counter"
import { PortfolioValueChart } from "../components/portfolio-value-chart"
import { TxTile } from "../components/tx-tile"

type OverviewViewProps = {
  lastMonthPrices: [number, number][]
  minaBalance: number
  fiatBalance: number
  chartLabel: string
  loading: boolean
  currentPriceIndex: number | undefined
  setCurrentPriceIndex: (currentPriceIndex: number | undefined) => void
  transactions: Tx[]
  publicAddress: string
  onSend: () => void
  onReceive: () => void
  useFiatBalance: boolean
  setUseFiatBalance: (useFiatBalance: boolean) => void
}

export const OverviewView = ({
  lastMonthPrices,
  minaBalance,
  fiatBalance,
  chartLabel,
  loading,
  currentPriceIndex,
  setCurrentPriceIndex,
  transactions,
  publicAddress,
  onSend,
  onReceive,
  useFiatBalance,
  setUseFiatBalance,
}: OverviewViewProps) => {
  const [bucks, cents] = (useFiatBalance ? fiatBalance : minaBalance)
    .toFixed(2)
    .toString()
    .split(".")

  const { t } = useTranslation()
  return (
    <AppLayout>
      <MenuBar variant="dashboard" publicAddress={publicAddress} />
      <Skeleton loading={loading} h="62px">
        <PortfolioValueChart
          lastMonthPrices={lastMonthPrices}
          setCurrentPriceIndex={setCurrentPriceIndex}
          currentPriceIndex={currentPriceIndex}
        />
      </Skeleton>
      <div className="card flex-col bg-secondary rounded-t-none px-8 pb-6 gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-primary">{t("portfolioValue")}</h1>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => setUseFiatBalance(!useFiatBalance)}
          >
            {t("use")} {useFiatBalance ? "Mina" : "Fiat"}
          </button>
        </div>
        <Skeleton loading={loading} h="65px">
          <h2 className="flex items-end">
            <span className="flex items-center text-6xl">
              <span>{useFiatBalance ? "$" : "M"}</span>
              <SlotCounter value={bucks} charClassName="font-work-sans" />
            </span>
            <span className="flex items-end text-lg">
              <span>.</span>
              <SlotCounter value={cents} charClassName="font-work-sans" />
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
            data-testid="dashboard/send"
          >
            {t("send")}
          </button>
          <button
            type="button"
            className="flex-1 btn btn-primary"
            onClick={onReceive}
            data-testid="dashboard/receive"
          >
            {t("receive")}
          </button>
        </div>
      </div>
      <div className="flex flex-col px-8 py-4 gap-3 pb-16">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-mint">{t("recent")}</p>
            <h2 className="text-xl">{t("transactions")}</h2>
          </div>
          <Link to="/transactions" className="flex items-center mb-[2px]">
            <span>{t("seeAll")}</span>
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {loading ? (
            <>
              <Skeleton loading={true} h="145px" />
              <Skeleton loading={true} h="145px" />
            </>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <TxTile
                key={tx.hash}
                tx={tx}
                currentWalletAddress={publicAddress}
              />
            ))
          ) : (
            <p className="col-span-2">{t("noTransactionsYet")}</p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
