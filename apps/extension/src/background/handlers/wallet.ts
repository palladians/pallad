import { useVault } from "@palladxyz/vault"
import type { NetworkName } from "@palladxyz/vault"
import { createMinaProvider } from "@palladxyz/web-provider"
import { serializeError } from "serialize-error"
import type { Handler } from "./"

export const palladSidePanel: Handler = async ({ sender }) => {
  await chrome.sidePanel.open({
    tabId: sender.tabId,
  })
}

export const palladSwitchNetwork: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    await useVault.persist.rehydrate()
    const { switchNetwork, getChainId } = useVault.getState()
    const network = data.network as NetworkName
    await switchNetwork(network)
    await useVault.persist.rehydrate()
    const chainId = getChainId()
    provider.emit("pallad_event", {
      data: {
        chainId: chainId,
      },
      type: "chainChanged",
    })
  } catch (error) {
    return { error: serializeError(error) }
  }
}

export const palladConnected: Handler = async () => {
  try {
    const provider = await createMinaProvider()
    await useVault.persist.rehydrate()
    const { getChainId } = useVault.getState()
    const chainId = getChainId()
    provider.emit("pallad_event", {
      data: {
        chainId: chainId,
      },
      type: "connect",
    })
  } catch (error) {
    return { error: serializeError(error) }
  }
}
