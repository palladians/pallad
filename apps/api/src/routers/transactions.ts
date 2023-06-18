import { z } from 'zod'

import { publicProcedure, router } from '../trpc'

export const transactionsRouter = router({
  index: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      const { transactions } = await ctx.minaExplorerSdk.Transactions({
        address: input.address
      })
      return transactions
    }),
  get: publicProcedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input, ctx }) => {
      const { transaction } = await ctx.minaExplorerSdk.Transaction({
        hash: input.hash
      })
      return transaction
    })
})
