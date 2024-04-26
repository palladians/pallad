import {
  type FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
} from "@palladxyz/key-management"
import { produce } from "immer"
import type { StateCreator } from "zustand"

import { type KeyAgentStore, initialKeyAgentState } from "./keyAgentState"

const initialState = {
  keyAgents: {},
}

export const keyAgentSlice: StateCreator<KeyAgentStore> = (set, get) => ({
  ...initialState,
  ensureKeyAgent(name) {
    return set(
      produce((state) => {
        if (!state.keyAgents[name]) {
          state.keyAgents[name] = { ...initialKeyAgentState, name: name }
        }
      }),
    )
  },
  async initialiseKeyAgent(
    name,
    keyAgentType,
    { mnemonicWords, getPassphrase },
  ) {
    const { ensureKeyAgent } = get()
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: "",
    }
    const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    ensureKeyAgent(name)
    return set(
      produce((state) => {
        state.keyAgents[name] = {
          keyAgentType: keyAgentType,
          keyAgent: keyAgent,
          serializableData: keyAgent.getSeralizableData(),
          name: name,
        }
      }),
    )
  },
  // This isn't used anywhere but is a nice abstraction over signing
  async request(name, credential, signable, args) {
    const { keyAgents } = get()
    const keyAgent = keyAgents[name]

    return await keyAgent?.keyAgent?.sign(credential, signable, args)
  },
  async createCredential(name, args, passphrase) {
    const { keyAgents } = get()
    const keyAgent = keyAgents[name]

    return await keyAgent?.keyAgent?.deriveCredentials(args, passphrase, true)
  },
  // we should deprecate this method
  // it is superseded by restoreKeyAgent
  getKeyAgent(name) {
    const { keyAgents } = get()
    return keyAgents[name]
  },
  restoreKeyAgent(name, getPassphrase) {
    const { keyAgents } = get()
    const keyAgentData = keyAgents[name]?.serializableData
    if (!keyAgentData) {
      throw new Error(`KeyAgent ${name} serializable data not found`)
    }
    return new InMemoryKeyAgent({ getPassphrase, ...keyAgentData })
  },
  removeKeyAgent(name) {
    return set(
      produce((state) => {
        delete state.keyAgents[name]
      }),
    )
  },
  clear() {
    return set(
      produce((state) => {
        state.keyAgents = {}
      }),
    )
  },
})
