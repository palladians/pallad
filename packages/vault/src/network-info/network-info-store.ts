import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { TokenInfoStore } from './token-info-state'

export const tokenInfoSlice: StateCreator<TokenInfoStore> = (set, get) => ({
  tokenInfo: {},
  setTokenInfo: (tokenInfo) => {
    const { ticker, tokenId } = tokenInfo
    set(
      produce((state) => {
        state.tokenInfo[ticker] = tokenId
      })
    )
  },
  getTokenInfo: (ticker) => {
    const { tokenInfo } = get()
    return { ticker: ticker, tokenId: tokenInfo[ticker] } || undefined
  },
  removeTokenInfo: (ticker) => {
    set(
      produce((state) => {
        delete state.tokenInfo[ticker]
      })
    )
  },
  allTokenInfo: () => {
    const { tokenInfo } = get()
    return Object.keys(tokenInfo).map((ticker) => ({
      ticker,
      tokenId: tokenInfo[ticker]
    }))
  },
  clear: () => {
    set(
      produce((state) => {
        state.tokenInfo = {}
      })
    )
  }
})
