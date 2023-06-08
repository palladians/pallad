import { createSWRProxyHooks } from '@trpc-swr/client'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@palladxyz/api'

export const trpc = createSWRProxyHooks<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3333'
    })
  ]
})
