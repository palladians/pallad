import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { DEFAULT_TOKEN_INFO } from './default'
import { TokenInfoStore } from './token-info-state'

export const tokenInfoSlice: StateCreator<TokenInfoStore> = (set, get) => ({
  tokenInfo: DEFAULT_TOKEN_INFO,
  setTokenInfo: (networkName, tokenInfo) => {
    const { ticker, tokenId } = tokenInfo
    set(
      produce((state) => {
        state.tokenInfo[networkName][ticker] = tokenId
      })
    )
  },
  getTokensInfo: (networkName) => {
    const { tokenInfo } = get()
    return tokenInfo[networkName] || {}
  },
  getTokenInfo: (networkName, ticker) => {
    const { tokenInfo } = get()
    const tokenId = tokenInfo[networkName]?.[ticker] ?? 'undefined'
    return { ticker: ticker, tokenId: tokenId } || undefined
  },
  removeTokenInfo: (networkName, ticker) => {
    set(
      produce((state) => {
        delete state.tokenInfo[networkName][ticker]
      })
    )
  },
  clear: () => {
    set(
      produce((state) => {
        state.tokenInfo = {}
      })
    )
  }
})
