import AsyncStorage from '@react-native-async-storage/async-storage'
import EncryptedStorage from 'react-native-encrypted-storage'
import { StateStorage } from 'zustand/middleware'

const sessionData = new Map()

export const securePersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await EncryptedStorage.getItem(name)) || null
  },
  setItem: async (name, value) => {
    await EncryptedStorage.setItem(name, value)
  },
  removeItem: async (name) => {
    await EncryptedStorage.removeItem(name)
  }
}

export const localPersistence: StateStorage = {
  getItem: async (name): Promise<string | null> => {
    return (await AsyncStorage.getItem(name)) || null
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value)
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name)
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
    await sessionData.delete(name)
  }
}
