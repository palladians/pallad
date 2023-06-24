export const MinaExplorerUrls = {
  Mainnet: new URL('https://api.minaexplorer.com'),
  Devnet: new URL('https://devnet.api.minaexplorer.com'),
  Berkeley: new URL('https://berkeley.api.minaexplorer.com')
} as Record<string, URL>

export const MinaExplorerGraphqlUrls = {
  Mainnet: new URL('https://graphql.minaexplorer.com'),
  Devnet: new URL('https://devnet.graphql.minaexplorer.com'),
  Berkeley: new URL('https://berkeley.graphql.minaexplorer.com')
} as Record<string, URL>

export const MINA_FIAT_PRICE_URL = new URL(
  'https://api.coingecko.com/api/v3/simple/price?ids=mina-protocol&vs_currencies=eur%2Cusd%2Cgbp'
)
