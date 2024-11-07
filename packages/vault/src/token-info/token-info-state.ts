export type TokenInfo = {
  ticker: string
  tokenId: string
  // todo: consider adding tokenOwner contract address
}

export type TokenInfoState = {
  tokenInfoV2: Record<string, Record<string, string>> // e.g. {'Mina - Devnet' : { MINA : "1" }}
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} TokenInfoStore
 */
export type TokenInfoActions = {
  setTokenInfo: (networkId: string, tokenInfo: TokenInfo) => void
  getTokenInfo: (networkId: string, ticker: string) => TokenInfo | undefined
  getTokensInfo: (networkId: string) => Record<string, string>
  removeTokenInfo: (networkId: string, ticker: string) => void
  clearTokenInfo: () => void
}

export type TokenInfoStore = TokenInfoState & TokenInfoActions
