import { initTRPC } from '@trpc/server'
import { createChromeHandler } from 'trpc-browser/adapter'
import { z } from 'zod'

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true
})

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  requestNetwork: publicProcedure
    .input(z.object({ network: z.string() }))
    .query(({ input }) => {
      return input.network
    }),
  requestAccounts: publicProcedure
    .input(z.object({ accounts: z.array(z.string()) }))
    .query(({ input }) => {
      return input.accounts
    })
})

createChromeHandler({
  router: appRouter
})
