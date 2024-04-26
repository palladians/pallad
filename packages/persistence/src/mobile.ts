import { Preferences } from "@capacitor/preferences"
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin"
import type { StateStorage } from "zustand/middleware"

const sessionData = new Map()

export const sessionPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await sessionData.get(name)) || null
  },
  setItem: async (name, value) => {
    await sessionData.set(name, value)
  },
  removeItem: async (name) => {
    await sessionData.delete(name)
  },
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
  },
}

export const securePersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await SecureStoragePlugin.get({ key: name })).value || null
  },
  setItem: async (name, value) => {
    await SecureStoragePlugin.set({ key: name, value })
  },
  removeItem: async (name) => {
    await SecureStoragePlugin.remove({ key: name })
  },
}
