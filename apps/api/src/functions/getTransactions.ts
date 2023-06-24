import { MinaExplorerGraphqlUrls } from '../constants'

const handler = async (req: Request) => {
  const reqUrl = new URL(req.url)
  const address = reqUrl.searchParams.get('address')
  const network = reqUrl.searchParams.get('network') || 'Mainnet'
  const request = await fetch(MinaExplorerGraphqlUrls[network]!, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query Transactions($address: String!) {
          transactions(query: { OR: [{ to: $address }, { from: $address }] }) {
            amount
            to
            token
            kind
            isDelegation
            hash
            from
            fee
            failureReason
            dateTime
            blockHeight
          }
        }
      `,
      variables: {
        address
      }
    })
  })
  const transactions = await request.json()
  return new Response(JSON.stringify(transactions))
}

export const config = {
  path: '/getTransactions'
}

export default handler
