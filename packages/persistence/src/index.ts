import * as webPersistence from "./web"

export const getLocalPersistence = () => webPersistence.localPersistence

export const getSessionPersistence = () => webPersistence.sessionPersistence

export const getSecurePersistence = () => webPersistence.securePersistence
