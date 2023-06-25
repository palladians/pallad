import { inferAsyncReturnType } from 'npm:@trpc/server'
import { FetchCreateContextFnOptions } from 'npm:@trpc/server/adapters/fetch'

import { MinaExplorerGraphqlUrls, MinaExplorerUrls } from './constants'

export const createContext = async ({ req }: FetchCreateContextFnOptions) => {
  const minaNetwork = req.headers.get('p-mina-network') || 'Mainnet'
  const minaExplorerRest = MinaExplorerUrls[minaNetwork]
  const minaExplorerGql = MinaExplorerGraphqlUrls[minaNetwork]
  return {
    minaExplorerRest,
    minaExplorerGql
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
