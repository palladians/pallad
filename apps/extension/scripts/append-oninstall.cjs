/* eslint-disable */
const fs = require('fs')
const path = require('path')

fs.appendFile(
  path.join(__dirname, '..', 'dist', 'service-worker-loader.js'),
  `chrome.runtime.onInstalled.addListener(({reason}) => reason === 'install' && chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') }))`,
  function (err) {
    if (err) throw err
    console.log('onInstall script appended.')
  }
)
