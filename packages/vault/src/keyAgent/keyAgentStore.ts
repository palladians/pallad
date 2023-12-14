import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { initialKeyAgentState, KeyAgentStore } from './keyAgentState'

const initialState = {
  keyAgents: {}
}

export const keyAgentSlice: StateCreator<KeyAgentStore> = (set, get) => ({
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
  async initialiseKeyAgent(
    name,
    keyAgentType,
    { mnemonicWords, getPassphrase }
  ) {
    const { ensureKeyAgent } = get()
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: ''
    }
    const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    ensureKeyAgent(name)
    return set(
      produce((state) => {
        state.keyAgents[name] = {
          keyAgentType: keyAgentType,
          keyAgent: keyAgent,
          serializableData: keyAgent.getSeralizableData(),
          name: name
        }
      })
    )
  },
  getKeyAgent(name) {
    const { keyAgents } = get()
    return keyAgents[name]?.keyAgent
    // Can be something like:
    //  reutrn keyAgents[name]?.serializableData
    // or even if we want another method to get the keyAgent instance
    // return new InMemoryKeyAgent({getPassphrase, ...serializableData!})
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
})
