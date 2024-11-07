import { produce } from "immer"
import type { StateCreator } from "zustand"

import { DEFAULT_TOKEN_INFO } from "./default"
import type { TokenInfoStore } from "./token-info-state"

export const tokenInfoSlice: StateCreator<TokenInfoStore> = (set, get) => ({
  tokenInfoV2: DEFAULT_TOKEN_INFO,
  setTokenInfo: (networkId, tokenInfo) => {
    const { ticker, tokenId } = tokenInfo
    set(
      produce((state) => {
        state.tokenInfo[networkId][ticker] = tokenId
      }),
    )
  },
  getTokensInfo: (networkId) => {
    const { tokenInfoV2 } = get()
    return tokenInfoV2[networkId] || {}
  },
  getTokenInfo: (networkId, ticker) => {
    const { tokenInfoV2 } = get()
    const tokenId = tokenInfoV2[networkId]?.[ticker] ?? "undefined"
    return { ticker: ticker, tokenId: tokenId } || undefined
  },
  removeTokenInfo: (networkId, ticker) => {
    set(
      produce((state) => {
        delete state.tokenInfo[networkId][ticker]
      }),
    )
  },
  clearTokenInfo: () => {
    set(
      produce((state) => {
        state.tokenInfo = DEFAULT_TOKEN_INFO
      }),
    )
  },
})
