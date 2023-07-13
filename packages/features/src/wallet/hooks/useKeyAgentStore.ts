import { keyAgentStore } from '@palladxyz/vault'
import { useStore } from 'zustand'

export const useKeyAgentStore = () => {
  return useStore(keyAgentStore)
}
