/**
 * @file Represents the state definitions related to keyAgents.
 */

import type {
  ChainDerivationArgs,
  ChainOperationArgs,
  ChainSignablePayload,
  ChainSignatureResult,
  FromBip39MnemonicWordsProps,
  GetPassphrase,
  GroupedCredentials,
  InMemoryKeyAgent,
  SerializableInMemoryKeyAgentData,
} from "@palladxyz/key-management"

export type KeyAgentName = string
export enum KeyAgents {
  InMemory = "IN_MEMORY_KEY_AGENT",
  Ledger = "LEDGER_KEY_AGENT",
  Trezor = "TREZOR_KEY_AGENT",
}
/**
 * Type representing the basic state of a keyAgent.
 */
export type SingleKeyAgentState = {
  name: string
  serializableData: SerializableInMemoryKeyAgentData | undefined
  keyAgentType: KeyAgents | undefined
  keyAgent: InMemoryKeyAgent | undefined
}

/**
 * Constant representing the initial key agent state
 */
export const initialKeyAgentState: SingleKeyAgentState = {
  name: "",
  serializableData: undefined,
  keyAgentType: undefined,
  keyAgent: undefined,
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
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
  ) => Promise<void>
  restoreKeyAgent: (
    name: KeyAgentName,
    passphrase: GetPassphrase,
  ) => InMemoryKeyAgent | undefined
  // example of a request method
  request: (
    name: KeyAgentName,
    credential: GroupedCredentials,
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
  ) => Promise<ChainSignatureResult | undefined>
  createCredential: (
    name: KeyAgentName,
    args: ChainDerivationArgs,
    passphrase: GetPassphrase,
  ) => Promise<GroupedCredentials | undefined>
  getKeyAgent: (name: KeyAgentName) => SingleKeyAgentState | undefined
  removeKeyAgent: (name: KeyAgentName) => void
  clearKeyAgents: () => void
}
