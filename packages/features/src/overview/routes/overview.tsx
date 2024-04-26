import { useFiatPrice } from "@palladxyz/offchain-data"
import { useMemo } from "react"

import { useAccount } from "@/common/hooks/use-account"

import { OverviewView } from "../views/overview"

export const OverviewRoute = () => {
  const account = useAccount()
  const { data: fiatPriceData } = useFiatPrice()
  const fiatBalance = useMemo(() => {
    if (!account.minaBalance) return 0
    const rawFiatPrice = fiatPriceData?.["mina-protocol"]?.usd || 0
    if (!rawFiatPrice) return 0
    return Number(account.minaBalance) * rawFiatPrice ?? 0
  }, [account.minaBalance, fiatPriceData])
  return <OverviewView account={account} fiatBalance={fiatBalance} />
}
