import { createChainProvider } from "@palladxyz/providers"
import type { ProviderConfig } from "@palladxyz/providers"

import { AddressError } from "../../lib/Errors"

export async function syncWalletHelper(
  get: any,
  networkId: string | undefined,
) {
  const {
    getCurrentNetworkInfo,
    setCurrentNetworkId,
    getNetworkInfo,
    getCurrentWallet,
    setNetworkInfo,
    _syncAccountInfo,
    _syncTransactions,
  } = get()
  if (networkId) setCurrentNetworkId(networkId)
  // when the wallet bricks this public key is undefined.
  const currentwallet = getCurrentWallet()
  const publicKey = currentwallet?.credential?.credential?.address // todo: DRY this up
  if (!publicKey)
    throw new AddressError("Wallet address is undefined in _syncWallet method")
  let syncProviderConfig: ProviderConfig
  if (!networkId) {
    syncProviderConfig = getCurrentNetworkInfo()
  } else {
    syncProviderConfig = getNetworkInfo(networkId)
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
  if (!response.daemonStatus.chainId) {
    throw new Error(
      `Could not get chainId for ${syncProviderConfig} in updateChainId`,
    )
  }
  setNetworkInfo(syncProviderConfig.networkId, {
    chainId: response.daemonStatus.chainId,
  })
  await _syncAccountInfo(syncProviderConfig, publicKey)
  await _syncTransactions(syncProviderConfig, publicKey)
}
