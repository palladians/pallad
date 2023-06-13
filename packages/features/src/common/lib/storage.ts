const webMode = import.meta.env.VITE_APP_MODE === 'web'
export const { localPersistence, securePersistence, sessionPersistence } =
  await import(webMode ? './storage.web' : './storage.native')
