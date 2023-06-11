import { MinaNetwork } from '@palladxyz/mina'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { GraphQLClient } from 'graphql-request'

import { MinaExplorerGraphqlUrls, MinaExplorerUrls } from './constants'
import { getSdk } from './gql/minaexplorer'

export const createContext = async ({ req }: CreateHTTPContextOptions) => {
  const rawMinaNetwork = req.headers['p-mina-network'] as MinaNetwork
  const minaNetwork = rawMinaNetwork
    ? MinaNetwork[rawMinaNetwork]
    : MinaNetwork[MinaNetwork.MAINNET]
  const minaExplorerUrl = MinaExplorerUrls[minaNetwork]
  const minaExplorerClient = new GraphQLClient(
    MinaExplorerGraphqlUrls[minaNetwork]
  )
  const minaExplorerSdk = getSdk(minaExplorerClient)
  return {
    minaExplorerSdk,
    minaExplorerUrl
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
