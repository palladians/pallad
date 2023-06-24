import { MinaNetwork } from '@palladxyz/mina'

export const MinaExplorerUrls = {
  [MinaNetwork[MinaNetwork.Mainnet]]: 'https://api.minaexplorer.com',
  [MinaNetwork[MinaNetwork.Devnet]]: 'https://devnet.api.minaexplorer.com',
  [MinaNetwork[MinaNetwork.Berkeley]]: 'https://berkeley.api.minaexplorer.com'
}

export const MinaExplorerGraphqlUrls = {
  [MinaNetwork[MinaNetwork.Mainnet]]: 'https://graphql.minaexplorer.com',
  [MinaNetwork[MinaNetwork.Devnet]]: 'https://devnet.graphql.minaexplorer.com',
  [MinaNetwork[MinaNetwork.Berkeley]]:
    'https://berkeley.graphql.minaexplorer.com'
}
