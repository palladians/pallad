import { MinaProvider, type ProviderEvent } from "@palladxyz/web-provider"
import { onMessage, sendMessage } from "webext-bridge/background"
import { runtime } from "webextension-polyfill"

// options should be defined by user
const opts = {
  projectId: "test",
  chains: ["Mina - Mainnet"],
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
  return await provider.enable({ origin: data.origin, sender: payload.sender })
})

onMessage("on", ({ data }) => {
  const { event /*, context*/ } = data as unknown as OnEventData
  const listenerId = registerListener(event /*, context*/)
  return { success: true, listenerId }
})

onMessage("off", ({ data }) => {
  const { listenerId } = data as unknown as OnMessageData
  removeListener(listenerId)

  return { success: true }
})

onMessage("mina_setState", async (data) => {
  return await provider.request({
    method: "mina_setState",
    params: data,
    sender: data.sender,
  })
})

onMessage("experimental_requestSession", async (data) => {
  return await provider.request({
    method: "experimental_requestSession",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_addChain", async (data) => {
  return await provider.request({
    method: "mina_addChain",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_requestNetwork", async (data) => {
  return await provider.request({
    method: "mina_requestNetwork",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_switchChain", async (data) => {
  return await provider.request({
    method: "mina_switchChain",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_getState", async (data) => {
  return await provider.request({
    method: "mina_getState",
    params: data,
    sender: data.sender,
  })
})

onMessage("isConnected", (payload) => {
  const data = payload.data as { origin: string }
  return provider.isConnected({ origin: data.origin })
})

onMessage("shouldOpenSidebar", (payload) => {
  const data = payload.data as { origin: string; method: string }
  return provider.shouldOpenSidebar({
    origin: data.origin,
    method: data.method,
  })
})

onMessage("mina_chainId", async (data) => {
  return await provider.request({
    method: "mina_chainId",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_accounts", async (data) => {
  return await provider.request({
    method: "mina_accounts",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_sign", async (data) => {
  return await provider.request({
    method: "mina_sign",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_signFields", async (data) => {
  return await provider.request({
    method: "mina_signFields",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_signTransaction", async (data) => {
  return await provider.request({
    method: "mina_signTransaction",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_getBalance", async (data) => {
  return await provider.request({
    method: "mina_getBalance",
    params: data,
    sender: data.sender,
  })
})

onMessage("mina_createNullifier", async (data) => {
  return await provider.request({
    method: "mina_createNullifier",
    params: data,
    sender: data.sender,
  })
})

runtime.onConnect.addListener((port) => {
  if (port.name === "prompt") {
    port.onDisconnect.addListener(async () => {
      await chrome.sidePanel.setOptions({
        path: "index.html",
        enabled: true,
      })
    })
  }
})

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
  if (message.type === "pallad_side_panel") {
    await chrome.sidePanel.open({
      tabId: sender.tab?.id ?? 0,
      windowId: sender.tab?.windowId,
    })
    response({ ok: true })
  }
  return true
})
