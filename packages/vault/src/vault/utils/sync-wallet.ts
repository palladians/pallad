import { createChainProvider } from '@palladxyz/providers'

import { AddressError } from '../../lib/Errors'

export async function syncWalletnHelper(get: any) {
  const {
    getCurrentNetworkInfo,
    getCurrentWallet,
    updateNetworkInfo,
    _syncAccountInfo,
    _syncTransactions
  } = get()
  // when the wallet bricks this public key is undefined.
  const currentwallet = getCurrentWallet()
  const publicKey = currentwallet?.credential?.credential?.address // todo: DRY this up
  if (!publicKey)
    throw new AddressError('Wallet address is undefined in _syncWallet method')
  const providerConfig = getCurrentNetworkInfo()
  // set the chainIds
  if (!providerConfig) {
    throw new Error(
      `Could not find providerConfig for ${providerConfig} in _syncWallet`
    )
  }
  const provider = createChainProvider(providerConfig)
  if (!provider.getNodeStatus) {
    throw new Error(
      `Could not getNodeStatus for ${providerConfig} in updateChainId`
    )
  }

  const response = await provider.getNodeStatus()
  if (!response.daemonStatus.chainId) {
    throw new Error(
      `Could not get chainId for ${providerConfig} in updateChainId`
    )
  }
  updateNetworkInfo(providerConfig.networkName, {
    chainId: response.daemonStatus.chainId
  })
  await _syncAccountInfo(providerConfig, publicKey)
  await _syncTransactions(providerConfig, publicKey)
}
