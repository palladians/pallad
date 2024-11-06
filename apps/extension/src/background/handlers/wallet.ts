import { useVault } from "@palladxyz/vault"
import type { NetworkId } from "@palladxyz/vault"
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
    const { switchNetwork, getNetworkId } = useVault.getState()
    const network = data.networkId as NetworkId
    await switchNetwork(network)
    await useVault.persist.rehydrate()
    const networkId = getNetworkId()
    provider.emit("pallad_event", {
      data: {
        networkId,
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
    const { getNetworkId } = useVault.getState()
    const networkId = getNetworkId()
    provider.emit("pallad_event", {
      data: {
        networkId,
      },
      type: "connect",
    })
  } catch (error) {
    return { error: serializeError(error) }
  }
}
