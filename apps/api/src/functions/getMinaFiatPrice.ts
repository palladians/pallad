import { MINA_FIAT_PRICE_URL } from '../constants'

const handler = async () => {
  const request = await fetch(MINA_FIAT_PRICE_URL)
  const fiatPrices = await request.json()
  return new Response(JSON.stringify({ data: { fiatPrices } }))
}

export const config = {
  path: '/getMinaFiatPrice'
}

export default handler
