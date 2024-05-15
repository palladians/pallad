import dayjs from "dayjs"
import useSWRImmutable from "swr/immutable"

import { MINA_FIAT_PRICE_URL } from "./const"
import { fetcher } from "./utils"

const requestUrl = new URL(MINA_FIAT_PRICE_URL)
requestUrl.searchParams.set("vs_currency", "usd")
requestUrl.searchParams.set(
  "from",
  dayjs().subtract(6, "months").unix().toString(),
)
requestUrl.searchParams.set("to", dayjs().unix().toString())

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
