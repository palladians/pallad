import { publicProcedure, router } from '../trpc'
import { z } from 'zod'

export const transactionsRouter = router({
  index: publicProcedure.input(z.object({ address: z.string() })).query(async ({ input, ctx }) => {
    const { transactions } = await ctx.minaExplorer.Transactions({ address: input.address })
    return transactions
  }),
  get: publicProcedure.input(z.object({ hash: z.string() })).query(async ({ input, ctx }) => {
    const { transaction } = await ctx.minaExplorer.Transaction({ hash: input.hash })
    return transaction
  })
})
