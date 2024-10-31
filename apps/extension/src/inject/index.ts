import { deserializeError } from "serialize-error"
import { onMessage, sendMessage } from "webext-bridge/content-script"
import { runtime } from "webextension-polyfill"

onMessage("pallad_event", async ({ data }) => {
  const palladEvent = new CustomEvent("pallad_event", {
    detail: data,
  })
  window.dispatchEvent(palladEvent)
})

const inject = () => {
  if (typeof document === "undefined") return
  const script = document.createElement("script")
  script.src = runtime.getURL("/rpc.js")
  script.type = "module"
  document.documentElement.appendChild(script)
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
        { params: data.params, context: { origin } },
        "background",
      )
      if (result?.error) {
        response = { jsonrpc: "2.0", error: deserializeError(result.error) }
      } else {
        response = { jsonrpc: "2.0", result }
      }
      return responseChannel.postMessage({
        response,
      })
    } catch (error) {
      response = { jsonrpc: "2.0", error }
      return responseChannel.postMessage({
        response,
      })
    }
  })
}

inject()
