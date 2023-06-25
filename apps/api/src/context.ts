import { inferAsyncReturnType } from 'https://esm.sh/@trpc/server@10.32.0'
import { FetchCreateContextFnOptions } from 'https://esm.sh/@trpc/server@10.32.0/adapters/fetch'

import { MinaExplorerGraphqlUrls, MinaExplorerUrls } from './constants'

export const createContext = ({ req }: FetchCreateContextFnOptions) => {
  const minaNetwork = req.headers.get('p-mina-network') || 'Mainnet'
  const minaExplorerRest = MinaExplorerUrls[minaNetwork]
  const minaExplorerGql = MinaExplorerGraphqlUrls[minaNetwork]
  return {
    minaExplorerRest,
    minaExplorerGql
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
