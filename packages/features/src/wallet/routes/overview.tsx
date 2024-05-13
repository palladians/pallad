import { useFiatPrice } from "@palladxyz/offchain-data"

import { useAccount } from "@/common/hooks/use-account"
import { useTransactions } from "@/common/hooks/use-transactions"

import { format } from "date-fns"
import { take, takeLast } from "rambda"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { OverviewView } from "../views/overview"

export const OverviewRoute = () => {
  const [currentPriceIndex, setCurrentPriceIndex] = useState<
    number | undefined
  >()
  const navigate = useNavigate()
  const account = useAccount()
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions()
  const latestTwoTransactions = take(2, transactions ?? [])
  const {
    data: fiatPriceData,
    current,
    isLoading: pricesLoading,
  } = useFiatPrice()
  const lastMonthPrices = takeLast(30, fiatPriceData?.prices ?? [])
  const minaPrice =
    typeof currentPriceIndex === "number"
      ? lastMonthPrices?.[currentPriceIndex]?.[1]
      : current
  const balance = Number(account.minaBalance) * (minaPrice ?? 0)
  const priceToday = lastMonthPrices?.[lastMonthPrices?.length - 1]?.[1] ?? 0
  const priceYesterday =
    lastMonthPrices?.[lastMonthPrices?.length - 2]?.[1] ?? 0
  const dailyPriceDiff = (priceToday - priceYesterday) / priceYesterday
  const dailyPriceDiffFiat = Math.abs(
    Number(account.minaBalance) * dailyPriceDiff,
  ).toFixed(2)
  const chartLabel =
    typeof currentPriceIndex === "undefined"
      ? `${dailyPriceDiff >= 0 ? "+" : "-"}${dailyPriceDiffFiat} (24h)`
      : format(lastMonthPrices[currentPriceIndex]?.[0], "MMM d")
  return (
    <OverviewView
      lastMonthPrices={lastMonthPrices}
      balance={balance}
      loading={pricesLoading || account.isLoading || transactionsLoading}
      chartLabel={chartLabel}
      currentPriceIndex={currentPriceIndex}
      setCurrentPriceIndex={setCurrentPriceIndex}
      transactions={latestTwoTransactions}
      publicAddress={account.data?.publicKey ?? ""}
      onSend={() => navigate("/send")}
      onReceive={() => navigate("/receive")}
    />
  )
}
