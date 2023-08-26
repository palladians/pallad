import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  initialKeyAgentState,
  keyAgentName,
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

          ensureKeyAgent: (name: keyAgentName) => {
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
            name: keyAgentName,
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

          getKeyAgent: (name: keyAgentName) => {
            return get().state.keyAgents[name] || initialKeyAgentState
          },

          removeKeyAgent: (name: keyAgentName) => {
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

  ensureKeyAgent(name: keyAgentName) {
    this.store.getState().ensureKeyAgent(name)
  }

  async initialiseKeyAgent(
    name: keyAgentName,
    keyAgentType: keyAgents,
    props: FromBip39MnemonicWordsProps
  ) {
    await this.store.getState().initialiseKeyAgent(name, keyAgentType, props)
  }

  getKeyAgent(name: keyAgentName) {
    return this.store.getState().getKeyAgent(name)
  }

  removeKeyAgent(name: keyAgentName) {
    this.store.getState().removeKeyAgent(name)
  }
}

export default KeyAgentStore
