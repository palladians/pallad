import { keyAgentStore } from '@palladxyz/vault'
import { useStore } from 'zustand'

// TODO: Do we need this?? Probably not
export const useKeyAgentStore = () => {
  return useStore(keyAgentStore)
}
