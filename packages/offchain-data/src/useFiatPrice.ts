import useSWR from 'swr'

import { MINA_FIAT_PRICE_URL } from './const'
import { fetcher } from './utils'

export const useFiatPrice = () => {
  return useSWR(MINA_FIAT_PRICE_URL, fetcher)
}
