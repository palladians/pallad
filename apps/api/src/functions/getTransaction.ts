import { MinaExplorerGraphqlUrls } from '../constants'

const handler = async (req: Request) => {
  const reqUrl = new URL(req.url)
  const hash = reqUrl.searchParams.get('hash')
  const network = reqUrl.searchParams.get('network') || 'Mainnet'
  const request = await fetch(MinaExplorerGraphqlUrls[network]!, {
    method: 'POST',
    body: JSON.stringify({
      query: `
        query Transaction($hash: String!) {
          transaction(query: { hash: $hash }) {
            amount
            blockHeight
            dateTime
            failureReason
            fee
            from
            hash
            isDelegation
            kind
            to
            token
          }
        }
      `,
      variables: {
        hash
      }
    })
  })
  const transaction = await request.json()
  return new Response(JSON.stringify(transaction))
}

export const config = {
  path: '/getTransaction'
}

export default handler
