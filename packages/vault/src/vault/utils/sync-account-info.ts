import { type ProviderConfig, createChainProvider } from "@palladco/providers"

export async function syncAccountHelper(
  get: any,
  providerConfig: ProviderConfig,
  publicKey: string,
) {
  const { setAccountInfo, getTokensInfo } = get()
  const provider = createChainProvider(providerConfig)
  const tokenMap = getTokensInfo(providerConfig.networkId)
  const accountInfo = await provider.getAccountInfo({
    publicKey: publicKey,
    tokenMap: tokenMap,
  })
  if (accountInfo === undefined) {
    throw new Error("accountInfo is undefined in _syncAccountInfo")
  }
  return setAccountInfo(providerConfig.networkId, publicKey, accountInfo)
}
