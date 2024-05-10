import useSWRImmutable from "swr/immutable"

import { MINA_FIAT_PRICE_URL } from "./const"
import { fetcher } from "./utils"

const requestUrl = new URL(MINA_FIAT_PRICE_URL)
requestUrl.searchParams.set("vs_currency", "usd")
requestUrl.searchParams.set("from", "1699539752")
requestUrl.searchParams.set("to", "1715260952")

interface FiatPriceResponse {
  market_caps: [number, number][]
  prices: [number, number][]
  total_volumes: [number, number][]
}

export const useFiatPrice = () => {
  const swr = useSWRImmutable<FiatPriceResponse>(requestUrl.toString(), fetcher)
  const prices = swr.data?.prices
  return {
    ...swr,
    current: prices?.[prices?.length - 1]?.[1] ?? 0,
  }
}
