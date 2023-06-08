import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { router } from './trpc'
import cors from 'cors'
import { createContext } from './context'
import { stakingRouter } from './routers/staking'
import { minaRouter } from './routers/mina'
import { transactionsRouter } from './routers/transactions'

export const appRouter = router({
  staking: stakingRouter,
  mina: minaRouter,
  transactions: transactionsRouter
})

export const handler = createHTTPHandler({
  middleware: cors({
    origin: '*'
  }),
  router: appRouter,
  createContext
})

export type AppRouter = typeof appRouter
