import { storage } from "webextension-polyfill"

export const chromeSessionProvider = (defaultCache: any) => {
  window.addEventListener("beforeunload", async () => {
    const appCache = JSON.stringify(Array.from(defaultCache.entries()))
    await storage.session.set({ appCache })
  })
  return defaultCache
}
