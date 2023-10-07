import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { getSecurePersistence } from '@palladxyz/persistence'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { initialKeyAgentState, KeyAgentState } from './keyAgentState'

const initialState = {
  keyAgents: {}
}

export const useKeyAgentStore = create<KeyAgentState>()(
  persist(
    immer((set) => ({
      ...initialState,
      ensureKeyAgent(name) {
        return set((state) => {
          if (!state.keyAgents[name]) {
            state.keyAgents[name] = { ...initialKeyAgentState, name: name }
          }
        })
      },
      async initialiseKeyAgent(
        name,
        keyAgentType,
        { mnemonicWords, getPassphrase }
      ) {
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
        return set((state) => {
          state.keyAgents[name] = {
            keyAgentType: keyAgentType,
            keyAgent: keyAgent,
            name: name
          }
        })
      },
      removeKeyAgent(name) {
        return set((state) => {
          delete state.keyAgents[name]
        })
      },
      clear() {
        return set((state) => {
          state.keyAgents = {}
        })
      }
    })),
    {
      name: 'PalladKeyAgent',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)
