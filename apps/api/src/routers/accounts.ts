import { z } from 'zod'

import { publicProcedure, router } from '../trpc'

export const accountsRouter = router({
  get: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      const accountDetailsUrl = `${ctx.minaExplorerUrl}/accounts/${input.address}`
      const request = await fetch(accountDetailsUrl)
      return request.json()
    })
})
