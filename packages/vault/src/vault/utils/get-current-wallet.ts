import type { SingleCredentialState } from "../../credentials"

export function validatePresence(value: any, fieldName: string) {
  if (!value) {
    throw new Error(
      `${fieldName} is still blank in getCurrentWallet (has not been set yet)`,
    )
  }
}

export function getPublicKey(credential: SingleCredentialState) {
  const publicKey = credential?.credential?.address ?? ""
  if (!publicKey) {
    throw new Error("publicKey is undefined or blank in getCurrentWallet")
  }
  return publicKey
}

export function getCurrentWalletHelper(get: any) {
  const {
    getKeyAgent,
    keyAgentName,
    getCredential,
    credentialName,
    getAccountsInfo,
    getCurrentNetworkInfo,
  } = get()

  validatePresence(keyAgentName, "keyAgentName")
  validatePresence(credentialName, "credentialName")

  const singleKeyAgentState = getKeyAgent(keyAgentName)
  const credential = getCredential(credentialName)
  const publicKey = getPublicKey(credential)
  const providerConfig = getCurrentNetworkInfo()
  const { accountInfo, transactions } = getAccountsInfo(
    providerConfig.networkName,
    publicKey,
  )

  return {
    singleKeyAgentState,
    credential,
    accountInfo,
    transactions,
  }
}
