import { MinaProvider, type ProviderEvent } from "@palladxyz/web-provider"
import { onMessage, sendMessage } from "webext-bridge/background"
//import { sendMessage } from 'webext-bridge/content-script'

// options should be defined by user
const opts = {
  projectId: "test",
  chains: ["Mina - Berkeley"],
}

const provider = await MinaProvider.init(opts, [])

// Example structure for listenerRegistry
type ListenerFunction = (args: any) => void // Adjust the 'any' type based on actual event arguments

interface ListenerRegistration {
  event: ProviderEvent
  listener: ListenerFunction
}

interface OnMessageData {
  listenerId: string
}

interface OnEventData {
  event: ProviderEvent
  context: any // Can be more specific type based on our context structure
}

const listenerRegistry: Record<string, ListenerRegistration> = {}

function generateListenerId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function registerListener(event: ProviderEvent /*, context: string*/): string {
  const listenerId = generateListenerId()
  const listener: ListenerFunction = (args) => {
    // Adjusting sendMessage call to match its signature
    sendMessage("eventTriggered", { listenerId, event, args }) // Assuming context is handled elsewhere or not needed
  }

  listenerRegistry[listenerId] = { event, listener }

  // Register with MinaProvider
  provider.on(event, listener)

  return listenerId
}

function removeListener(listenerId: string): void {
  const registration = listenerRegistry[listenerId]
  if (registration) {
    const { event, listener } = registration
    provider.off(event, listener)
    delete listenerRegistry[listenerId]
  }
}

onMessage("enable", async (payload) => {
  const data = payload.data as { origin: string }
  return await provider.enable({ origin: data.origin })
})

onMessage("on", ({ data }) => {
  const { event /*, context*/ } = data as unknown as OnEventData
  const listenerId = registerListener(event /*, context*/)
  console.log("test emitted event", event)
  return { success: true, listenerId }
})

onMessage("off", ({ data }) => {
  const { listenerId } = data as unknown as OnMessageData
  removeListener(listenerId)

  return { success: true }
})

onMessage("mina_setState", async (data) => {
  return await provider.request({ method: "mina_setState", params: data })
})

onMessage("experimental_requestSession", async (data) => {
  return await provider.request({
    method: "experimental_requestSession",
    params: data,
  })
})

onMessage("mina_addChain", async (data) => {
  return await provider.request({ method: "mina_addChain", params: data })
})

onMessage("mina_requestNetwork", async (data) => {
  return await provider.request({ method: "mina_requestNetwork", params: data })
})

onMessage("mina_switchChain", async (data) => {
  return await provider.request({ method: "mina_switchChain", params: data })
})

onMessage("mina_getState", async (data) => {
  //return await provider.request({ method: 'mina_getState' })
  return await provider.request({ method: "mina_getState", params: data })
})

onMessage("isConnected", (payload) => {
  const data = payload.data as { origin: string }
  return provider.isConnected({ origin: data.origin })
})

onMessage("mina_chainId", async () => {
  return await provider.request({ method: "mina_chainId" })
})

onMessage("mina_accounts", async () => {
  return await provider.request({ method: "mina_accounts" })
})

onMessage("mina_sign", async (data) => {
  return await provider.request({ method: "mina_sign", params: data })
})

onMessage("mina_signFields", async (data) => {
  return await provider.request({ method: "mina_signFields", params: data })
})

onMessage("mina_signTransaction", async (data) => {
  return await provider.request({
    method: "mina_signTransaction",
    params: data,
  })
})

onMessage("mina_getBalance", async () => {
  return await provider.request({ method: "mina_getBalance" })
})

onMessage("mina_createNullifier", async (data) => {
  return await provider.request({
    method: "mina_createNullifier",
    params: data,
  })
})
