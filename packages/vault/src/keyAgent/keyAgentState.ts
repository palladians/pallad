/**
 * @file Represents the state definitions related to keyAgents.
 */

import {
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent
} from '@palladxyz/key-management'

export type KeyAgentName = string
export enum KeyAgents {
  InMemory = 'IN_MEMORY_KEY_AGENT',
  Ledger = 'LEDGER_KEY_AGENT',
  Trezor = 'TREZOR_KEY_AGENT'
}
/**
 * Type representing the basic state of a keyAgent.
 */
export type SingleKeyAgentState = {
  name: string
  keyAgentType: KeyAgents | undefined
  keyAgent: InMemoryKeyAgent | undefined
}

/**
 * Constant representing the initial key agent state
 */
export const initialKeyAgentState: SingleKeyAgentState = {
  name: '',
  keyAgentType: undefined,
  keyAgent: undefined
}

/**
 * Type representing the aggregation of all keyAgents by name
 */
export type InStoreKeyAgents = Record<KeyAgentName, SingleKeyAgentState>

/**
 * Type representing the store's state and actions combined.
 */
export type KeyAgentStore = {
  keyAgents: InStoreKeyAgents
  ensureKeyAgent: (name: KeyAgentName) => void
  initialiseKeyAgent: (
    name: KeyAgentName,
    keyAgentType: KeyAgents,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ) => Promise<void>
  getKeyAgent: (name: KeyAgentName) => InMemoryKeyAgent | undefined
  removeKeyAgent: (name: KeyAgentName) => void
  clear: () => void
}
