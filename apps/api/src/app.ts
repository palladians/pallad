import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { router } from './trpc'
import cors from 'cors'
import { createContext } from './context'
import { stakingRouter } from './routers/staking'
import { minaRouter } from './routers/mina'
import { transactionsRouter } from './routers/transactions'
import { accountsRouter } from './routers/accounts'

export const appRouter = router({
  staking: stakingRouter,
  mina: minaRouter,
  transactions: transactionsRouter,
  accounts: accountsRouter
})

export const handler = createHTTPHandler({
  middleware: cors({
    origin: '*'
  }),
  router: appRouter,
  createContext
})

export type AppRouter = typeof appRouter
