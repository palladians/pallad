import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  initialKeyAgentState,
  keyAgents,
  KeyAgentStores
} from './keyAgentState'

export class KeyAgentStore {
  private store: any

  constructor() {
    this.store = createStore<KeyAgentStores>(
      persist(
        (set, get) => ({
          state: {
            keyAgents: {}
          },

          ensureKeyAgent: (name) => {
            set((current) => {
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
            name,
            keyAgentType: keyAgents,
            { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps // for a ledger or trezor key agent this would be optional
          ) => {
            const agentArgs: FromBip39MnemonicWordsProps = {
              getPassphrase: getPassphrase,
              mnemonicWords: mnemonicWords,
              mnemonic2ndFactorPassphrase: ''
            }
            const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
            set((current) => ({
              ...current,
              state: {
                ...current.state,
                keyAgents: {
                  ...current.state.keyAgents,
                  [name]: {
                    ...current.state.keyAgents[name],
                    // TODO: make this keyAgentType configurable from args
                    keyAgentType: keyAgentType,
                    keyAgent: keyAgent
                  }
                }
              }
            }))
          },

          getKeyAgent: (name) => {
            return get().state.keyAgents[name] || initialKeyAgentState
          },

          removeKeyAgent: (name) => {
            set((current) => {
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
    )
  }

  ensureKeyAgent(name) {
    this.store.getState().ensureKeyAgent(name)
  }

  async initialiseKeyAgent(name, keyAgentType, props) {
    await this.store.getState().initialiseKeyAgent(name, keyAgentType, props)
  }

  getKeyAgent(name) {
    return this.store.getState().getKeyAgent(name)
  }

  removeKeyAgent(name) {
    this.store.getState().removeKeyAgent(name)
  }
}

export default KeyAgentStore
