import { MinaProvider } from '@palladxyz/web-provider'
import { onMessage } from 'webext-bridge/background'

// options should be defined by user
const opts = {
  projectId: 'test',
  chains: ['Mina - Berkeley']
}

//const store = useVault((state) => state)
const provider = await MinaProvider.init(opts, [])

onMessage('enable', async (payload) => {
  console.log('test enable method', payload.data)
  const data = payload.data as { origin: string }
  return await provider.enable({ origin: data.origin })
})

onMessage('mina_setState', async (data) => {
  console.log('test mina_setState method', data)
  //return await provider.request({ method: 'mina_setState', params: data })
  return await provider.request({ method: 'mina_setState', params: data })
})

onMessage('mina_getState', async (data) => {
  console.log('test mina_getState method')
  //return await provider.request({ method: 'mina_getState' })
  return await provider.request({ method: 'mina_getState', params: data })
})

onMessage('isConnected', (payload) => {
  console.log('test isConnected method')
  const data = payload.data as { origin: string }
  return provider.isConnected({ origin: data.origin })
})

onMessage('mina_chainId', async () => {
  console.log('test mina_chainId method')
  return await provider.request({ method: 'mina_chainId' })
})

onMessage('mina_accounts', async () => {
  console.log('test mina_accounts method')
  return await provider.request({ method: 'mina_accounts' })
})

onMessage('mina_sign', async (data) => {
  console.log('test mina_sign method')
  return await provider.request({ method: 'mina_sign', params: data })
})

onMessage('mina_signFields', async (data) => {
  console.log('test mina_signFields method')
  return await provider.request({ method: 'mina_signFields', params: data })
})

onMessage('mina_signTransaction', async (data) => {
  console.log('test mina_signTransaction method')
  return await provider.request({
    method: 'mina_signTransaction',
    params: data
  })
})

onMessage('mina_getBalance', async () => {
  console.log('test mina_getBalance method')
  return await provider.request({ method: 'mina_getBalance' })
})

onMessage('mina_createNullifier', async (data) => {
  console.log('test mina_createNullifier method')
  return await provider.request({
    method: 'mina_createNullifier',
    params: data
  })
})
