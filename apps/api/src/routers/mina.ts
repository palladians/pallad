import { publicProcedure, router } from '../trpc'

const MINA_FIAT_PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=mina-protocol&vs_currencies=eur%2Cusd%2Cgbp'

export const minaRouter = router({
  fiatPrice: publicProcedure.query(async () => {
    const request = await fetch(MINA_FIAT_PRICE_URL)
    const fiatPrices = await request.json()
    return fiatPrices['mina-protocol']
  })
})
