import { MinaExplorerUrls } from '../constants'

const handler = async (req: Request) => {
  const reqUrl = new URL(req.url)
  const address = reqUrl.searchParams.get('address')
  const network = reqUrl.searchParams.get('network') || 'Mainnet'
  const accountRequestUrl = new URL(
    `${MinaExplorerUrls[network]}/accounts/${address}`
  )
  const request = await fetch(accountRequestUrl)
  const account = await request.json()
  return new Response(JSON.stringify({ data: account }))
}

export const config = {
  path: '/getAccount'
}

export default handler
