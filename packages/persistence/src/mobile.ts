import { Store } from '@tauri-apps/plugin-store'
import { StateStorage } from 'zustand/middleware'

const sessionData = new Map()
const store = new Store('.pallad.dat')

export const sessionPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await sessionData.get(name)) || null
  },
  setItem: async (name, value) => {
    await sessionData.set(name, value)
  },
  removeItem: async (name) => {
    await sessionData.delete(name)
  }
}

export const localPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return await store.get(name)
  },
  setItem: async (name, value) => {
    await store.set(name, { value })
    await store.save()
  },
  removeItem: async (name) => {
    await store.delete(name)
    await store.save()
  }
}

export const securePersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return await store.get(name)
  },
  setItem: async (name, value) => {
    await store.set(name, { value })
    await store.save()
  },
  removeItem: async (name) => {
    await store.delete(name)
    await store.save()
  }
}
