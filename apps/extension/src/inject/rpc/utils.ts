import debounce from "p-debounce"

const BROADCAST_CHANNEL_ID = "pallad"

const callPalladAsync = ({
  method,
  payload,
}: { method: string; payload: any }) => {
  return new Promise((resolve, reject) => {
    const privateChannelId = `private-${Math.random()}`
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_ID)
    const responseChannel = new BroadcastChannel(privateChannelId)
    const messageListener = ({ data }: any) => {
      channel.close()
      const error = data.response?.error
      if (error) {
        try {
          console.table(JSON.parse(error.message))
        } catch {
          console.info(error.message)
        }
        return reject(error)
      }
      return resolve(data.response)
    }
    responseChannel.addEventListener("message", messageListener)
    channel.postMessage({
      method,
      payload,
      isPallad: true,
      respondAt: privateChannelId,
    })
    return channel.close()
  })
}

export const debouncedCall = debounce(callPalladAsync, 300)
