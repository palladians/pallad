import { httpBatchLink } from '@trpc/client'
import { createSWRProxyHooks } from '@trpc-swr/client'

import { appStore } from '../store/app'

export const trpc = createSWRProxyHooks({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_APP_API_URL,
      headers() {
        const network = appStore.getState().network
        return {
          'p-mina-network': network
        }
      }
    })
  ]
})
