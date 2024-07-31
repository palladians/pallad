import { MinaProvider, Validation } from "@palladxyz/web-provider"
import { serializeError } from "serialize-error"
import { onMessage } from "webext-bridge/background"
import { runtime, tabs } from "webextension-polyfill"

const E2E_TESTING = import.meta.env.VITE_APP_E2E === "true"

const opts = {
  projectId: "test",
  chains: ["Mina - Mainnet"],
}

onMessage("enable", async ({ data }) => {
  try {
    const provider = await MinaProvider.init(opts, [])
    const { origin } = Validation.requestSchema.parse(data)
    return await provider.enable({ origin })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_setState", async ({ data }) => {
  try {
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
    const { origin } = Validation.requestSchema.parse(data)
    return await provider.isConnected({ origin })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("mina_chainId", async ({ data }) => {
  try {
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
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
    const provider = await MinaProvider.init(opts, [])
    const params = Validation.sendTransactionRequestSchema.parse(data)
    return await provider.request({
      method: "mina_sendTransaction",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
})

onMessage("pallad_sidePanel", async ({ sender }) => {
  await chrome.sidePanel.open({
    tabId: sender.tabId,
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

runtime.onInstalled.addListener(async ({ reason }) => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  if (reason === "install") {
    if (!E2E_TESTING)
      await tabs.create({ url: "https://get.pallad.co/welcome" })
  }
})
