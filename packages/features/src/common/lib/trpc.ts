import type { AppRouter } from '@palladxyz/api'
import { httpBatchLink } from '@trpc/client'
import { createSWRProxyHooks } from '@trpc-swr/client'

import { useAppStore } from '../store/app'

export const trpc = createSWRProxyHooks<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_APP_API_URL,
      headers() {
        const network = useAppStore.getState().network
        return {
          'p-mina-network': network
        }
      }
    })
  ]
})
