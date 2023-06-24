import { appStore } from '@palladxyz/features'
import { createTRPCUntypedClient } from '@trpc/client'
import { chromeLink } from 'trpc-browser/link'
import { runtime } from 'webextension-polyfill'

const port = runtime.connect()
const trpcClient = createTRPCUntypedClient({
  links: [chromeLink({ port })]
})

const inject = () => {
  const script = document.createElement('script')
  script.src = runtime.getURL('/inject.js')
  script.type = 'module'
  document.documentElement.appendChild(script)
  console.log('[Pallad] Wallet Provider has been injected.')
  const channel = new BroadcastChannel('pallad')
  channel.addEventListener('message', ({ data }) => {
    const responseChannel = new BroadcastChannel(data.respondAt)
    if (!data.isPallad)
      return responseChannel.postMessage({ error: 'Wrong context' })
    trpcClient
      .query(data.method, {
        network: appStore.getState().network
      })
      .then((response) => {
        return responseChannel.postMessage({ response })
      })
  })
}

inject()
