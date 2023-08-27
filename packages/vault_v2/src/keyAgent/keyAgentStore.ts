import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createStore, StoreApi } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  initialKeyAgentState,
  keyAgentName,
  keyAgents,
  KeyAgentState,
  SingleKeyAgentState
} from './keyAgentState'

export class KeyAgentStore {
  private store: StoreApi<KeyAgentState>

  constructor() {
    const persistedStore = persist<KeyAgentState>(
      (set, get) => ({
        state: {
          keyAgents: {}
        },
        getState: get as () => KeyAgentState,

        ensureKeyAgent: (name: keyAgentName) => {
          set((current: KeyAgentState) => {
            if (!current.state.keyAgents[name]) {
              return {
                ...current,
                state: {
                  ...current.state,
                  keyAgents: {
                    ...current.state.keyAgents,
                    [name]: { ...initialKeyAgentState, name: name }
                  }
                }
              }
            }
            return current
          })
        },

        initialiseKeyAgent: async (
          name: keyAgentName,
          keyAgentType: keyAgents,
          { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
        ) => {
          const agentArgs: FromBip39MnemonicWordsProps = {
            getPassphrase: getPassphrase,
            mnemonicWords: mnemonicWords,
            mnemonic2ndFactorPassphrase: ''
          }
          const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
          set((current: KeyAgentState) => {
            const existingAgentState = current.state.keyAgents[name] || {}

            return {
              ...current,
              state: {
                ...current.state,
                keyAgents: {
                  ...current.state.keyAgents,
                  [name]: {
                    ...existingAgentState,
                    keyAgentType: keyAgentType,
                    keyAgent: keyAgent,
                    name: name
                  }
                }
              }
            }
          })
        },

        getKeyAgent: (
          name: keyAgentName
        ): SingleKeyAgentState | typeof initialKeyAgentState => {
          const current = get()
          return current.state.keyAgents[name] || initialKeyAgentState
        },

        removeKeyAgent: (name: keyAgentName) => {
          set((current: KeyAgentState) => {
            const newKeyAgents = { ...current.state.keyAgents }
            delete newKeyAgents[name]
            return {
              ...current,
              state: {
                ...current.state,
                keyAgents: newKeyAgents
              }
            }
          })
        }
      }),
      {
        name: 'PalladKeyAgent',
        storage: createJSONStorage(getSecurePersistence)
      }
    )

    this.store = createStore<KeyAgentState>(persistedStore as any)
  }

  ensureKeyAgent(name: keyAgentName): void {
    this.store.getState().ensureKeyAgent(name)
  }

  async initialiseKeyAgent(
    name: keyAgentName,
    keyAgentType: keyAgents,
    props: FromBip39MnemonicWordsProps
  ): Promise<void> {
    await this.store.getState().initialiseKeyAgent(name, keyAgentType, props)
  }

  getKeyAgent(
    name: keyAgentName
  ): SingleKeyAgentState | typeof initialKeyAgentState {
    return this.store.getState().getKeyAgent(name)
  }

  removeKeyAgent(name: keyAgentName): void {
    this.store.getState().removeKeyAgent(name)
  }
}

export default KeyAgentStore
