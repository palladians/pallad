import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { APIRoute } from 'astro'

import { appRouter } from '../../trpc/app'
import { createContext } from '../../trpc/context'

export const all: APIRoute = ({ request }) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext
  })
}

export const getStaticPaths = () =>
  Object.keys(appRouter._def.procedures).map((procedure) => ({
    params: { trpc: procedure }
  }))
