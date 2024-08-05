import { MinaProvider } from "@palladxyz/web-provider"
import { onMessage, sendMessage } from "webext-bridge/background"
import { runtime, tabs } from "webextension-polyfill"
import {
  minaAccounts,
  minaAddChain,
  minaChainId,
  minaCreateNullifier,
  minaGetBalance,
  minaGetState,
  minaRequestAccounts,
  minaRequestNetwork,
  minaSendTransaction,
  minaSetState,
  minaSign,
  minaSignFields,
  minaSignTransaction,
  minaSwitchChain,
  palladConnected,
  palladIsConnected,
  palladSidePanel,
  palladSwitchNetwork,
} from "./handlers"

const E2E_TESTING = import.meta.env.VITE_APP_E2E === "true"

/**
 * Web Connector handlers
 */
onMessage("mina_setState", minaSetState)
onMessage("mina_addChain", minaAddChain)
onMessage("mina_requestNetwork", minaRequestNetwork)
onMessage("mina_switchChain", minaSwitchChain)
onMessage("mina_getState", minaGetState)
onMessage("mina_chainId", minaChainId)
onMessage("mina_accounts", minaAccounts)
// TODO: It should be removed, but let's keep it for now for Auro compatibility.
onMessage("mina_requestAccounts", minaRequestAccounts)
onMessage("mina_sign", minaSign)
onMessage("mina_signFields", minaSignFields)
onMessage("mina_signTransaction", minaSignTransaction)
onMessage("mina_getBalance", minaGetBalance)
onMessage("mina_createNullifier", minaCreateNullifier)
onMessage("mina_sendTransaction", minaSendTransaction)

/**
 * Wallet handlers
 */
onMessage("pallad_isConnected", palladIsConnected)
onMessage("pallad_switchNetwork", palladSwitchNetwork)
onMessage("pallad_connected", palladConnected)
onMessage("pallad_sidePanel", palladSidePanel)

/**
 * Runtime
 */
runtime.onConnect.addListener(async (port) => {
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
  const provider = await MinaProvider.getInstance()
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  if (reason === "install") {
    if (!E2E_TESTING)
      await tabs.create({ url: "https://get.pallad.co/welcome" })
  }
  provider.on("pallad_event", async (data) => {
    const { permissions } = await chrome.storage.local.get("permissions")
    const urls = Object.entries(permissions)
      .filter(([_, allowed]) => allowed === "ALLOWED")
      .map(([url]) => `${url}/*`)
    const allowedTabs = await tabs.query({ url: urls })
    for (const tab of allowedTabs) {
      await sendMessage("pallad_event", data, `content-script@${tab.id}`)
    }
  })
})
