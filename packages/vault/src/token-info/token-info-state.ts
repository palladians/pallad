export type TokenInfo = {
  ticker: string
  tokenId: string
}
/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} TokenInfoStore
 */
export type TokenInfoStore = {
  tokenInfo: Record<string, string>
  setTokenInfo: (tokenInfo: TokenInfo) => void
  getTokenInfo: (ticker: string) => TokenInfo | undefined
  removeTokenInfo: (ticker: string) => void
  allTokenInfo: () => TokenInfo[]
  clear: () => void
}
