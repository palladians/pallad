import { sendMessage } from 'webext-bridge/content-script'
import { runtime } from 'webextension-polyfill'

const inject = () => {
  const script = document.createElement('script')
  script.src = runtime.getURL('/inject.js')
  script.type = 'module'
  document.documentElement.appendChild(script)
  console.info('[Pallad] RPC has been initialized.')
  const channel = new BroadcastChannel('pallad')
  channel.addEventListener('message', async ({ data }) => {
    const responseChannel = new BroadcastChannel(data.respondAt)
    if (!data.isPallad)
      return responseChannel.postMessage({ error: 'Wrong context' })
    const result = await sendMessage(data.method, data.payload, 'background')
    return responseChannel.postMessage({ response: { jsonrpc: '1.0', result } })
  })
}

inject()
