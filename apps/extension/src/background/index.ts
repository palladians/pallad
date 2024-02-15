import { MinaProvider } from '@palladxyz/web-provider'
import { onMessage } from 'webext-bridge/background'
import { runtime } from 'webextension-polyfill'

// options should be defined by user
const opts = {
  projectId: 'test',
  chains: ['Mina - Berkeley']
}
const provider = await MinaProvider.init(opts, [])

// Does this do anything?
runtime.onInstalled.addListener(() => {
  onMessage('enable', async () => {
    console.log('test enable method')
    return await provider.enable()
  })
})

// Register message handlers directly, not inside any other callback
onMessage('enable', async () => {
  console.log('test enable method')
  return await provider.enable()
})

onMessage('mina_setState', async () => {
  console.log('test mina_setState method')
  //return await provider.request({ method: 'mina_setState', params: data })
  return 'TODO: implement mina_setState'
})

onMessage('mina_getState', async () => {
  console.log('test mina_getState method')
  //return await provider.request({ method: 'mina_getState' })
  return {
    credential: {
      name: 'Pallad',
      proof: {
        publicInputs: [1],
        publicOutputs: [100],
        proof: '1hjdjf83...fjf'
      }
    }
  }
})

onMessage('isConnected', async () => {
  console.log('test isConnected method')
  return await provider.isConnected()
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
