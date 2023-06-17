import { MinaNetwork } from '@palladxyz/mina'
import { inferAsyncReturnType } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { GraphQLClient } from 'graphql-request'

import { MinaExplorerGraphqlUrls, MinaExplorerUrls } from './constants'
import { getSdk } from './gql/minaexplorer'

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const rawMinaNetwork = req.headers.get('p-mina-network') as MinaNetwork
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
