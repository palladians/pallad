export const VITE_APP_MODE = import.meta.env['VITE_APP_MODE'] || 'web'
import * as nativePersistence from './mobile'
import * as webPersistence from './web'

export const getLocalPersistence = () =>
  VITE_APP_MODE === 'web'
    ? webPersistence.localPersistence
    : nativePersistence.localPersistence

export const getSessionPersistence = () =>
  VITE_APP_MODE === 'web'
    ? webPersistence.sessionPersistence
    : nativePersistence.sessionPersistence

export const getSecurePersistence = () =>
  VITE_APP_MODE === 'web'
    ? webPersistence.securePersistence
    : nativePersistence.securePersistence
