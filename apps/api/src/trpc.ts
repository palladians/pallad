import { serve } from 'https://deno.land/std@0.155.0/http/server.ts'
import { initTRPC } from 'https://esm.sh/@trpc/server@10.32.0'
import { fetchRequestHandler } from 'https://esm.sh/@trpc/server@10.32.0/adapters/fetch'
import { gql, request } from 'https://esm.sh/graphql-request@6.1.0'
import { z } from 'https://esm.sh/zod@3.21.4'

import { MINA_FIAT_PRICE_URL } from './constants'
import { Context, createContext } from './context'
import validatorsData from './data/validators.json'

export const t = initTRPC.context<Context>().create()
export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  getValidators: publicProcedure.query(() => validatorsData.validators),
  getAccount: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      const accountDetailsUrl = `${ctx.minaExplorerRest}/accounts/${input.address}`
      const request = await fetch(accountDetailsUrl)
      return request.json()
    }),
  getMinaFiatPrice: publicProcedure.query(async () => {
    const request = await fetch(MINA_FIAT_PRICE_URL)
    const fiatPrices = await request.json()
    return fiatPrices['mina-protocol']
  }),
  getTransactions: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = gql`
        query Transactions($address: String!) {
          transactions(query: { OR: [{ to: $address }, { from: $address }] }) {
            amount
            to
            token
            kind
            isDelegation
            hash
            from
            fee
            failureReason
            dateTime
            blockHeight
          }
        }
      `
      const data = await request(ctx.minaExplorerGql, query, {
        address: input.address
      })
      return data.transactions
    }),
  getTransaction: publicProcedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input, ctx }) => {
      const query = gql`
        query Transaction($hash: String!) {
          transaction(query: { hash: $hash }) {
            amount
            blockHeight
            dateTime
            failureReason
            fee
            from
            hash
            isDelegation
            kind
            to
            token
          }
        }
      `
      const data = await request(ctx.minaExplorerGql, query, {
        hash: input.hash
      })
      return data.transaction
    })
})

export type AppRouter = typeof appRouter

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext
  })
serve(handler)
