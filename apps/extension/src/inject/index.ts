import { deserializeError } from "serialize-error"
import { sendMessage } from "webext-bridge/content-script"
import { runtime } from "webextension-polyfill"

const inject = () => {
  const script = document.createElement("script")
  script.src = runtime.getURL("/pallad_rpc.js")
  script.type = "module"
  document.documentElement.appendChild(script)
  console.info("[Pallad] RPC has been initialized.")
  const channel = new BroadcastChannel("pallad")
  channel.addEventListener("message", async ({ data }) => {
    const origin = window.location.origin
    const responseChannel = new BroadcastChannel(data.respondAt)
    if (!data.isPallad)
      return responseChannel.postMessage({ error: "Wrong context" })
    let response
    try {
      const result: any = await sendMessage(
        data.method,
        { ...data.payload, origin },
        "background",
      )
      if (result?.error) {
        response = { jsonrpc: "1.0", error: deserializeError(result.error) }
      } else {
        response = { jsonrpc: "1.0", result }
      }
      return responseChannel.postMessage({
        response,
      })
    } catch (error) {
      response = { jsonrpc: "1.0", error }
      return responseChannel.postMessage({
        response,
      })
    }
  })
}

inject()
