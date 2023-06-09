export enum MinaNetwork {
  MAINNET = 'MAINNET',
  DEVNET = 'DEVNET',
  BERKELEY = 'BERKELEY'
}

export const MinaExplorerUrls = {
  [MinaNetwork[MinaNetwork.MAINNET]]: 'https://api.minaexplorer.com',
  [MinaNetwork[MinaNetwork.DEVNET]]: 'https://devnet.api.minaexplorer.com',
  [MinaNetwork[MinaNetwork.BERKELEY]]: 'https://berkeley.api.minaexplorer.com'
}

export const MinaExplorerGraphqlUrls = {
  [MinaNetwork[MinaNetwork.MAINNET]]: 'https://graphql.minaexplorer.com',
  [MinaNetwork[MinaNetwork.DEVNET]]: 'https://devnet.graphql.minaexplorer.com',
  [MinaNetwork[MinaNetwork.BERKELEY]]: 'https://berkeley.graphql.minaexplorer.com'
}
