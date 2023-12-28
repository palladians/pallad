import { Preferences } from '@capacitor/preferences'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'
import superjson from 'superjson'
import { StateStorage } from 'zustand/middleware'

const sessionData = new Map()

export const sessionPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await sessionData.get(name)) || null
  },
  setItem: async (name, value) => {
    sessionData.set(name, value)
  },
  removeItem: async (name) => {
    sessionData.delete(name)
  }
}

export const localPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await Preferences.get({ key: name })).value || null
  },
  setItem: async (name, value) => {
    await Preferences.set({ key: name, value })
  },
  removeItem: async (name) => {
    await Preferences.remove({ key: name })
  }
}

export const securePersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    const value = (await SecureStoragePlugin.get({ key: name })).value || ''
    return superjson.parse(value)
  },
  setItem: async (name, value) => {
    await SecureStoragePlugin.set({
      key: name,
      value: superjson.stringify(value)
    })
  },
  removeItem: async (name) => {
    await SecureStoragePlugin.remove({ key: name })
  }
}
