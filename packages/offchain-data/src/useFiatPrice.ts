import useSWR from 'swr'

import { MINA_FIAT_PRICE_URL } from './const'
import { fetcher } from './utils'

interface FiatPriceResponse {
  'mina-protocol': {
    eur: number
    usd: number
    gbp: number
  }
}

export const useFiatPrice = () => {
  return useSWR<FiatPriceResponse>(MINA_FIAT_PRICE_URL, fetcher)
}
