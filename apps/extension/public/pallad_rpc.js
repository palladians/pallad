/* eslint-disable */
const BROADCAST_CHANNEL_ID = 'pallad'
const callPalladAsync = ({ method, payload }) =>
  new Promise((resolve, reject) => {
    const privateChannelId = `private-${Math.random()}`
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_ID)
    const responseChannel = new BroadcastChannel(privateChannelId)
    responseChannel.addEventListener('message', ({ data }) => {
      channel.close()
      if (data.error) return reject(data.error)
      return resolve(data.response)
    })
    channel.postMessage({
      method,
      payload,
      isPallad: true,
      respondAt: privateChannelId
    })
    return channel.close()
  })
const init = () => {
  window.mina = {
    request: ({ method, params }) =>
      callPalladAsync({ method, payload: params }),
    enable: async () => {
      const response = await callPalladAsync({
        method: 'enable',
        payload: { origin: window.location.origin }
      })
      return response
    },
    isPallad: true,
    isConnected: async () => {
      const response = await callPalladAsync({
        method: 'isConnected',
        payload: { origin: window.location.origin }
      })
      return response
    }
  }
}
init()
