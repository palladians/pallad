import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { MinaExplorerGraphqlUrls, MinaExplorerUrls, MinaNetwork } from './constants'
import { inferAsyncReturnType } from '@trpc/server'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from './gql/minaexplorer'

export const createContext = async ({ req }: CreateHTTPContextOptions) => {
  const rawMinaNetwork = req.headers['p-mina-network'] as MinaNetwork
  const minaNetwork = rawMinaNetwork ? MinaNetwork[rawMinaNetwork] : MinaNetwork[MinaNetwork.MAINNET]
  const minaExplorerUrl = MinaExplorerUrls[minaNetwork]
  const minaExplorerClient = new GraphQLClient(MinaExplorerGraphqlUrls[minaNetwork])
  const minaExplorerSdk = getSdk(minaExplorerClient)
  return {
    minaExplorerSdk,
    minaExplorerUrl
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
