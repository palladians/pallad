export type TokenInfo = {
  ticker: string
  tokenId: string
  // todo: consider adding tokenOwner contract address
}

export type TokenInfoState = {
  tokenInfo: Record<string, Record<string, string>> // e.g. {'Mina - Devnet' : { MINA : "1" }}
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} TokenInfoStore
 */
export type TokenInfoActions = {
  setTokenInfo: (networkName: string, tokenInfo: TokenInfo) => void
  getTokenInfo: (networkName: string, ticker: string) => TokenInfo | undefined
  getTokensInfo: (networkName: string) => Record<string, string>
  removeTokenInfo: (networkName: string, ticker: string) => void
  clear: () => void
}

export type TokenInfoStore = TokenInfoState & TokenInfoActions
