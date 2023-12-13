import { type BrowserContext, chromium, test as base } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  /* eslint-disable */
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../dist')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers()
    if (!background) background = await context.waitForEvent('serviceworker')

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  }
})
export const expect = test.expect
