import browser from 'webextension-polyfill'

console.log('BG')

browser.runtime.onMessage.addListener(async (msg, sender) => {
  console.log('BG page received message', msg, 'from', sender)
  console.log('Stored data', await browser.storage.local.get())
})
