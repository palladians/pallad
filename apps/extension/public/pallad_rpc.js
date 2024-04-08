/* eslint-disable */
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
const debouncedCall = debounce(callPalladAsync, 300)
const init = () => {
  window.mina = {
    wallet: {
      name: 'Pallad',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTY1IiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE2NSAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik04Mi4zNTMgMTg4LjIzNkM4Mi4zNTMgMTg4LjIzNiAxNTIuOTQxIDE1Mi45NDIgMTUyLjk0MSAxMDAuMDAxVjM4LjIzNjJMODIuMzUzIDExLjc2NTZMMTEuNzY0OCAzOC4yMzYyVjEwMC4wMDFDMTEuNzY0OCAxNTIuOTQyIDgyLjM1MyAxODguMjM2IDgyLjM1MyAxODguMjM2WiIgc3Ryb2tlPSJ1cmwoI3BhaW50MF9saW5lYXJfMTUxXzQ5NikiIHN0cm9rZS13aWR0aD0iMTcuNjc4NiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik02OS4zNTA2IDQ4LjYzNzdDNzEuMTE5NSA0NC4xMzYzIDc1LjQ2MzYgNDEuMTc2MyA4MC4zMDAxIDQxLjE3NjNIODIuMzEwMUM4Ny4xNDE4IDQxLjE3NjMgOTEuNDgxOCA0NC4xMyA5My4yNTQyIDQ4LjYyNDVMMTIxLjA5NSAxMTkuMjEzQzEyNC4xMzkgMTI2LjkzMyAxMTguNDQ5IDEzNS4yOTQgMTEwLjE1MSAxMzUuMjk0SDEwOC4wODdMNzguNjAxMiA1NC45OTc3SDgzLjQ3MThMNTMuOTg2MSAxMzUuMjk0SDUyLjU1ODVDNDQuMjY1NyAxMzUuMjk0IDM4LjU3NTcgMTI2Ljk0NCA0MS42MDkgMTE5LjIyNkw2OS4zNTA2IDQ4LjYzNzdaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMTUxXzQ5NikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8xNTFfNDk2IiB4MT0iMTYxLjc2NSIgeTE9IjUuODgzMjciIHgyPSI4LjgyMzYiIHkyPSIyMDAuMDAxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxRkQ3RkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOEQ3QUZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xNTFfNDk2IiB4MT0iMTYxLjc2NSIgeTE9IjIuOTQwOTgiIHgyPSI1Ljg4MjM5IiB5Mj0iMTk3LjA1OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMUZEN0ZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhEN0FGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='
    },
    request: async ({ method, params }) =>
      debouncedCall({ method, payload: params }),
    enable: async () => {
      return debouncedCall({
        method: 'enable',
        payload: { origin: window.location.origin }
      })
    },
    isPallad: true,
    isConnected: async () => {
      return debouncedCall({
        method: 'isConnected',
        payload: { origin: window.location.origin }
      })
    },
    otherOn: async () => {
      return 'hello world!'
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
        method: 'on',
        payload: { event, listenerId }
      })
    },
    /*once: async (event, listenerId) => {
      const response = await debouncedCall({
        method: 'once',
        payload: { event, listenerId }
      })
      return response
    },
    removeListener: async (event, listenerId) => {
      const response = await debouncedCall({
        method: 'removeListener',
        payload: { event, listenerId }
      })
      return response
    },*/
    off: async (event, listenerId) => {
      return debouncedCall({
        method: 'off',
        payload: { event, listenerId }
      })
    }
  }
}
init()
