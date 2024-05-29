import { createChainProvider } from "@palladxyz/providers"
import type { ProviderConfig } from "@palladxyz/providers"

import { AddressError } from "../../lib/Errors"

export async function syncWalletnHelper(
  get: any,
  networkName: string | undefined,
) {
  const {
    getCurrentNetworkInfo,
    getNetworkInfo,
    getCurrentWallet,
    updateNetworkInfo,
    _syncAccountInfo,
    _syncTransactions,
  } = get()
  // when the wallet bricks this public key is undefined.
  const currentwallet = getCurrentWallet()
  console.log("currentWallet in syncWallet", currentwallet)
  const publicKey = currentwallet?.credential?.credential?.address // todo: DRY this up
  if (!publicKey)
    throw new AddressError("Wallet address is undefined in _syncWallet method")
  let syncProviderConfig: ProviderConfig
  if (!networkName) {
    syncProviderConfig = getCurrentNetworkInfo()
  } else {
    syncProviderConfig = getNetworkInfo(networkName)
  }
  // set the chainIds
  if (!syncProviderConfig) {
    throw new Error(
      `Could not find providerConfig for ${syncProviderConfig} in _syncWallet`,
    )
  }
  const provider = createChainProvider(syncProviderConfig)
  if (!provider.getNodeStatus) {
    throw new Error(
      `Could not getNodeStatus for ${syncProviderConfig} in updateChainId`,
    )
  }

  const response = await provider.getNodeStatus()
  console.log("node response for chain info in syncWallet", response)
  if (!response.daemonStatus.chainId) {
    throw new Error(
      `Could not get chainId for ${syncProviderConfig} in updateChainId`,
    )
  }
  updateNetworkInfo(syncProviderConfig.networkName, {
    chainId: response.daemonStatus.chainId,
  })
  await _syncAccountInfo(syncProviderConfig, publicKey)
  await _syncTransactions(syncProviderConfig, publicKey)
}
