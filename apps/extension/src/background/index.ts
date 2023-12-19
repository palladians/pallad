import { onMessage } from 'webext-bridge/background'
import { runtime } from 'webextension-polyfill'

runtime.onInstalled.addListener(() => {
  onMessage('mina_chainId', () => {
    return 'Berkeley'
  })
})
