import { Storage } from '@plasmohq/storage'
import { SecureStorage } from '@plasmohq/storage/secure'
import superjson from 'superjson'
import { PersistStorage, StateStorage } from 'zustand/middleware'

superjson.registerCustom<Buffer, number[]>(
  {
    isApplicable: (v): v is Buffer => v instanceof Buffer,
    serialize: (v) => [...v],
    deserialize: (v) => Buffer.from(v)
  },
  'buffer'
)

const localData = new Storage({ area: 'local' })

const sessionData = new Storage({
  area: 'session'
})

const secureStorage = new SecureStorage({
  area: 'local'
})

const setVaultSpendingPassword = async () => {
  const spendingPassword = await sessionData.get('spendingPassword')
  return secureStorage.setPassword(spendingPassword)
}

export const securePersistence: PersistStorage<any> = {
  getItem: async (name): Promise<any | null> => {
    await setVaultSpendingPassword()
    const value = await secureStorage.get(name)
    return superjson.parse(value)
  },
  setItem: async (name, value) => {
    await setVaultSpendingPassword()
    await secureStorage.set(name, superjson.stringify(value))
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

export const sessionPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await sessionData.get(name)) || null
  },
  setItem: async (name, value) => {
    await sessionData.set(name, value)
  },
  removeItem: async (name) => {
    await sessionData.remove(name)
  }
}
