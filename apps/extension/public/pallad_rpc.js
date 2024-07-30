function debounce(func, wait, immediate) {
  let timeout
  return function (...args) {
    return new Promise((resolve) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        if (!immediate) {
          Promise.resolve(func.apply(this, [...args])).then(resolve)
        }
      }, wait)
      if (immediate && !timeout) {
        Promise.resolve(func.apply(this, [...args])).then(resolve)
      }
    })
  }
}
const BROADCAST_CHANNEL_ID = "pallad"
const callPalladAsync = ({ method, payload }) => {
  return new Promise((resolve, reject) => {
    const privateChannelId = `private-${Math.random()}`
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_ID)
    const responseChannel = new BroadcastChannel(privateChannelId)
    responseChannel.addEventListener("message", ({ data }) => {
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
    })
    channel.postMessage({
      method,
      payload,
      isPallad: true,
      respondAt: privateChannelId,
    })
    return channel.close()
  })
}
const debouncedCall = debounce(callPalladAsync, 300, false)
const init = () => {
  const info = {
    slug: "pallad",
    name: "Pallad",
    icon: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzAwIDMwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE5OF8yNDY5NSkiPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgcng9IjEyIiBmaWxsPSIjRjZDMTc3Ii8+CjxwYXRoIGQ9Ik05MCAyMTRDOTAgMjExLjc5MSA5MS43OTA5IDIxMCA5NCAyMTBIMTM2QzE0My43MzIgMjEwIDE1MCAyMTYuMjY4IDE1MCAyMjRWMjI2QzE1MCAyMzMuNzMyIDE0My43MzIgMjQwIDEzNiAyNDBIMTA0Qzk2LjI2OCAyNDAgOTAgMjMzLjczMiA5MCAyMjZWMjE0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgNjRDOTAgNjEuNzkwOSA5MS43OTA5IDYwIDk0IDYwSDE5NkMyMDMuNzMyIDYwIDIxMCA2Ni4yNjggMjEwIDc0Vjc2QzIxMCA4My43MzIgMjAzLjczMiA5MCAxOTYgOTBIMTA0Qzk2LjI2OCA5MCA5MCA4My43MzIgOTAgNzZWNjRaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTRDMjEwIDkxLjc5MDkgMjExLjc5MSA5MCAyMTQgOTBIMjI2QzIzMy43MzIgOTAgMjQwIDk2LjI2OCAyNDAgMTA0VjEzNkMyNDAgMTQzLjczMiAyMzMuNzMyIDE1MCAyMjYgMTUwSDIyNEMyMTYuMjY4IDE1MCAyMTAgMTQzLjczMiAyMTAgMTM2Vjk0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNNjAgOTRDNjAgOTEuNzkwOSA2MS43OTA5IDkwIDY0IDkwSDc2QzgzLjczMiA5MCA5MCA5Ni4yNjggOTAgMTA0VjE5NkM5MCAyMDMuNzMyIDgzLjczMiAyMTAgNzYgMjEwSDc0QzY2LjI2OCAyMTAgNjAgMjAzLjczMiA2MCAxOTZWOTRaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwSDE5NkMyMDMuNzMyIDE1MCAyMTAgMTU2LjI2OCAyMTAgMTY0VjE2NkMyMTAgMTczLjczMiAyMDMuNzMyIDE4MCAxOTYgMTgwSDE2NEMxNTYuMjY4IDE4MCAxNTAgMTczLjczMiAxNTAgMTY2VjE1MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTIxMCAxNTBIMTk1QzE5NSAxNTAgMjAxIDE1MCAyMDUuNSAxNTQuNUMyMTAgMTU5IDIxMCAxNjUgMjEwIDE2NVYxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgMTUwTDIyNSAxNTBDMjI1IDE1MCAyMTkgMTUwIDIxNC41IDE0NS41QzIxMCAxNDEgMjEwIDEzNSAyMTAgMTM1TDIxMCAxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgMTUwTDIxMCAxMzVDMjEwIDEzNSAyMTAgMTQxIDIwNS41IDE0NS41QzIwMSAxNTAgMTk1IDE1MCAxOTUgMTUwTDIxMCAxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik05MCA5MEg3NUM3NSA5MCA4MSA5MCA4NS41IDk0LjVDOTAgOTkgOTAgMTA1IDkwIDEwNVY5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDkwTDEwNSA5MEMxMDUgOTAgOTkgOTAgOTQuNSA4NS41QzkwIDgxIDkwIDc1IDkwIDc1TDkwIDkwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgOTBMOTAgMTA1QzkwIDEwNSA5MCA5OSA5NC41IDk0LjVDOTkgOTAgMTA1IDkwIDEwNSA5MEw5MCA5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTIxMCA5MEgxOTVDMTk1IDkwIDIwMSA5MCAyMDUuNSA5NC41QzIxMCA5OSAyMTAgMTA1IDIxMCAxMDVWOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTBMMjEwIDc1QzIxMCA3NSAyMTAgODEgMjA1LjUgODUuNUMyMDEgOTAgMTk1IDkwIDE5NSA5MEwyMTAgOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTBMMjEwIDEwNUMyMTAgMTA1IDIxMCA5OSAyMTQuNSA5NC41QzIxOSA5MCAyMjUgOTAgMjI1IDkwTDIxMCA5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDIxMEwxMDUgMjEwQzEwNSAyMTAgOTkgMjEwIDk0LjUgMjA1LjVDOTAgMjAxIDkwIDE5NSA5MCAxOTVMOTAgMjEwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgMjEwTDkwIDE5NUM5MCAxOTUgOTAgMjAxIDg1LjUgMjA1LjVDODEgMjEwIDc1IDIxMCA3NSAyMTBMOTAgMjEwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgMjEwTDkwIDIyNUM5MCAyMjUgOTAgMjE5IDk0LjUgMjE0LjVDOTkgMjEwIDEwNSAyMTAgMTA1IDIxMEw5MCAyMTBaIiBmaWxsPSIjMjUyMzNBIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTk4XzI0Njk1Ij4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHJ4PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
    rdns: "co.pallad.wallet",
  }
  const provider = {
    request: async ({ method, params }) =>
      debouncedCall({
        method,
        payload: { ...params, origin: window.location.origin },
      }),
    enable: async () => {
      return debouncedCall({
        method: "enable",
        payload: { origin: window.location.origin },
      })
    },
    isPallad: true,
    isConnected: async () => {
      return debouncedCall({
        method: "isConnected",
        payload: { origin: window.location.origin },
      })
    },
    /*
    Note: `listenerId` is used as a placeholder to identify listener functions.
    Since functions can't be serialized over postMessage, you need to implement
    a system in your background script to manage listeners and associate them with
    IDs. When an event occurs, you can then send a message back to the content
    script to invoke the appropriate listener by ID.
    */
    // I don't think we need listenerId for `on`, `once`
    on: async (event, listenerId) => {
      return debouncedCall({
        method: "on",
        payload: { event, listenerId },
      })
    },
    off: async (event, listenerId) => {
      return debouncedCall({
        method: "off",
        payload: { event, listenerId },
      })
    },
  }
  window.mina = provider
  const announceProvider = () => {
    window.dispatchEvent(
      new CustomEvent("mina:announceProvider", {
        detail: Object.freeze({ info, provider }),
      }),
    )
  }
  window.addEventListener("mina:requestProvider", (event) => {
    announceProvider()
  })
  announceProvider()
}
init()
