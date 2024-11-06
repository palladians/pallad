export function restartWalletHelper(get: any) {
  const {
    getCurrentWallet,
    keyAgentName,
    getCurrentNetworkId,
    removeKeyAgent,
    removeAccount,
    removeCredential,
  } = get()
  const currentWallet = getCurrentWallet()
  const currentNetwork = getCurrentNetworkId()
  removeAccount(currentNetwork, "")
  removeKeyAgent(keyAgentName)
  removeCredential(currentWallet.credential.credentialName)
}
