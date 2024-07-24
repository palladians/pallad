const fs = require("node:fs")
const path = require("node:path")
const dedent = require("dedent")

const script = dedent`
  chrome.runtime.onInstalled.addListener(async ({reason}) => {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    if (reason === 'install') {
      await chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') })
    }
  })
`

fs.appendFile(
  path.join(__dirname, "..", "dist", "service-worker-loader.js"),
  script,
  (err) => {
    if (err) throw err
    console.log("onInstall script appended.")
  },
)
