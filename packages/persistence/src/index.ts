export const VITE_APP_MODE = import.meta.env['VITE_APP_MODE'] || 'web'
import * as nativePersistence from './mobile'
import * as webPersistence from './web'

export const getLocalPersistence = () =>
  VITE_APP_MODE === 'mobile'
    ? nativePersistence.localPersistence
    : webPersistence.localPersistence

export const getSessionPersistence = () =>
  VITE_APP_MODE === 'mobile'
    ? nativePersistence.sessionPersistence
    : webPersistence.sessionPersistence

export const getSecurePersistence = () =>
  VITE_APP_MODE === 'mobile'
    ? nativePersistence.securePersistence
    : webPersistence.securePersistence
