import { appStore, MinaChainId } from '@palladxyz/features'
import { onMessage } from 'webext-bridge/background'
import { runtime } from 'webextension-polyfill'

runtime.onInstalled.addListener(() => {
  onMessage('mina_chainId', () => {
    return MinaChainId[appStore.getState().network]
  })
})
