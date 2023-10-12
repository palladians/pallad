import { getSecurePersistence } from '@palladxyz/persistence'
import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { initialKeyAgentState, KeyAgentState } from './keyAgentState'

const initialState = {
  keyAgents: {}
}

export const useKeyAgentStore = create<KeyAgentState>()(
  persist(
    (set) => ({
      ...initialState,
      ensureKeyAgent(name) {
        return set(
          produce((state) => {
            if (!state.keyAgents[name]) {
              state.keyAgents[name] = { ...initialKeyAgentState, name: name }
            }
          })
        )
      },
      async initialiseKeyAgent(name, keyAgentType, InMemoryKeyAgent) {
        console.log('>>>KI EJDZENT', InMemoryKeyAgent)
        return set(
          produce((state) => {
            state.keyAgents[name] = {
              keyAgentType: keyAgentType,
              keyAgent: InMemoryKeyAgent,
              name: name
            }
          })
        )
      },
      removeKeyAgent(name) {
        return set(
          produce((state) => {
            delete state.keyAgents[name]
          })
        )
      },
      clear() {
        return set(
          produce((state) => {
            state.keyAgents = {}
          })
        )
      }
    }),
    {
      name: 'PalladKeyAgent',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)
