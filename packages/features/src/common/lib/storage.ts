import { Storage } from '@plasmohq/storage'
import { SecureStorage } from '@plasmohq/storage/secure'
import { StateStorage } from 'zustand/middleware'

export const localData = new Storage({ area: 'local' })

export const sessionData = new Storage({
  area: 'session'
})

export const secureStorage = new SecureStorage()

const setVaultSpendingPassword = async () => {
  const spendingPassword = await sessionData.get('spendingPassword')
  return secureStorage.setPassword(spendingPassword)
}

export const storagePersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    await setVaultSpendingPassword()
    return (await secureStorage.get(name)) || null
  },
  setItem: async (name, value) => {
    await setVaultSpendingPassword()
    await secureStorage.set(name, value)
  },
  removeItem: async (name) => {
    await setVaultSpendingPassword()
    await secureStorage.remove(name)
  }
}

export const localPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await localData.get(name)) || null
  },
  setItem: async (name, value) => {
    await localData.set(name, value)
  },
  removeItem: async (name) => {
    await localData.remove(name)
  }
}
