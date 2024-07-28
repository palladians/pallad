import {
  MinaProvider,
  type ProviderEvent,
  Validation,
} from "@palladxyz/web-provider"
import { serializeError } from "serialize-error"
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

onMessage("enable", async ({ data }) => {
  try {
    const { origin } = Validation.requestSchema.parse(data)
    return await provider.enable({ origin })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
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

onMessage("mina_setState", async ({ data }) => {
  try {
    const params = Validation.setStateRequestSchema.parse(data)
    return await provider.request({
      method: "mina_setState",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_addChain", async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
})

onMessage("mina_requestNetwork", async ({ data }) => {
  try {
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_requestNetwork",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_switchChain", async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
})

onMessage("mina_getState", async ({ data }) => {
  try {
    const params = Validation.getStateRequestSchema.parse(data)
    return await provider.request({
      method: "mina_getState",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("isConnected", async ({ data }) => {
  try {
    const { origin } = Validation.requestSchema.parse(data)
    return await provider.isConnected({ origin })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_chainId", async ({ data }) => {
  try {
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_chainId",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_accounts", async ({ data }) => {
  try {
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_accounts",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

// TODO: It should be removed, but let's keep it for now for Auro compatibility.
onMessage("mina_requestAccounts", async ({ data }) => {
  try {
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_accounts",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_sign", async ({ data }) => {
  try {
    const params = Validation.signMessageRequestSchema.parse(data)
    return await provider.request({
      method: "mina_sign",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_signFields", async ({ data }) => {
  try {
    const params = Validation.signFieldsRequestSchema.parse(data)
    return await provider.request({
      method: "mina_signFields",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_signTransaction", async ({ data }) => {
  try {
    const params = Validation.signTransactionRequestSchema.parse(data)
    return await provider.request({
      method: "mina_signTransaction",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_getBalance", async ({ data }) => {
  try {
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_getBalance",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_createNullifier", async ({ data }) => {
  try {
    const params = Validation.createNullifierRequestSchema.parse(data)
    return await provider.request({
      method: "mina_createNullifier",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_sendTransaction", async ({ data }) => {
  try {
    const params = Validation.sendTransactionRequestSchema.parse(data)
    return await provider.request({
      method: "mina_sendTransaction",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
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
