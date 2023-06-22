const VITE_APP_MODE = import.meta.env.VITE_APP_MODE || 'web'

export const { localPersistence, securePersistence, sessionPersistence } =
  VITE_APP_MODE === 'web'
    ? await import('./storage.web')
    : await import('./storage.native')
