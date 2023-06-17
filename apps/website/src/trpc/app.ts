import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { createContext } from './context'
import { accountsRouter } from './routers/accounts'
import { minaRouter } from './routers/mina'
import { stakingRouter } from './routers/staking'
import { transactionsRouter } from './routers/transactions'
import { router } from './trpc'

export const appRouter = router({
  staking: stakingRouter,
  mina: minaRouter,
  transactions: transactionsRouter,
  accounts: accountsRouter
})

export const handler = (request: Request) =>
  fetchRequestHandler({
    req: request,
    endpoint: '/trpc',
    router: appRouter,
    createContext
  })

export type AppRouter = typeof appRouter
