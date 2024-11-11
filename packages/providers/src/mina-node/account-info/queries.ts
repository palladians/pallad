export const healthCheckQuery = `
{
  syncStatus
}
`

export const getAccountBalance = `
  query accountBalance($publicKey: PublicKey!) {
    account(publicKey: $publicKey) {
      balance {
        total
      },
      nonce
      inferredNonce
      delegate
      publicKey
    }
  }
`
import type { TokenIdMap } from "@palladco/mina-core"

export function getTokenAccountInfoQuery(tokenIds: TokenIdMap): string {
  // Start with the base part of the query
  let queryString = "query tokenQuery($publicKey: PublicKey!) {\n"

  // Dynamically add account queries based on tokenIds
  for (const [alias, tokenId] of Object.entries(tokenIds)) {
    queryString += `  ${alias}: account(token: "${tokenId}", publicKey: $publicKey) {\n    ...AccountFields\n  }\n`
  }

  // Add the fragment definition
  queryString +=
    "}\n\nfragment AccountFields on Account {\n  balance {\n    total\n  }\n  tokenSymbol\n  tokenId\n  nonce\n  inferredNonce\n  publicKey\n  delegate\n}"

  return queryString
}
