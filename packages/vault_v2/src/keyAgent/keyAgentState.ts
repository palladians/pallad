/**
 * @file Represents the state definitions related to accounts.
 */

import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'

export type keyAgentName = string
export enum keyAgents {
  inMemory = 'IN_MEMORY_KEY_AGENT',
  ledger = 'LEDGER_KEY_AGENT',
  trezor = 'TREZOR_KEY_AGENT'
}
/**
 * Type representing the basic state of an account.
 * @typedef {Object} SingleAccountState
 */
export type SingleKeyAgentState = {
  name: string
  keyAgentType: keyAgents | undefined
  keyAgent: InMemoryKeyAgent | undefined
}

/**
 * Constant representing the initial key agent state
 * @typedef {Object}
 */
export const initialKeyAgentState: SingleKeyAgentState = {
  name: '',
  keyAgentType: undefined,
  keyAgent: undefined
}

/**
 * Type representing the aggregation of all keyAgents by name
 * @typedef {Object} AccountStoreState
 */
export type KeyAgentStoreState = {
  keyAgents: Record<keyAgentName, SingleKeyAgentState>
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} AccountState
 */
export type KeyAgentState = {
  state: KeyAgentStoreState

  ensureKeyAgent: (name: keyAgentName) => void

  /**
   * 
   * @param name name of key agent to initialise
   * @param param1 mnemonic and passphrase
   * @returns void
   * 
   * implementation details: 
   * 
   const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)

        // set both the keyAgent and the serializableKeyAgentData
        set({ keyAgent })
   */
  initialiseKeyAgent: (
    name: keyAgentName,
    keyAgentType: keyAgents,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ) => void

  getKeyAgent: (
    name: keyAgentName
  ) => SingleKeyAgentState | typeof initialKeyAgentState

  removeKeyAgent: (name: keyAgentName) => void
}

/**
 * The type of the store returned by createStore.
 * @typedef {Object} AccountStore
 */
export type KeyAgentStores = ReturnType<typeof KeyAgentState>
