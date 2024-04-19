import { PalladNetworkNames } from '@palladxyz/pallad-core'

export function restartWalletHelper(get: any) {
  const {
    getCurrentWallet,
    keyAgentName,
    getCurrentNetwork,
    removeKeyAgent,
    removeAccount,
    removeCredential
  } = get()
  const currentWallet = getCurrentWallet()
  const currentNetwork = getCurrentNetwork()
  removeAccount(currentNetwork as PalladNetworkNames, '')
  removeKeyAgent(keyAgentName)
  removeCredential(currentWallet.credential.credentialName)
}
