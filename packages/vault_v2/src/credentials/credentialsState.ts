/**
 * @file Represents the state definitions related to credentials specific to keyAgents & accounts.
 */

import { GroupedCredentials } from '@palladxyz/key-management'

import { keyAgentName } from '../keyAgent/keyAgentState'

export type credentialName = string
export type storedCredential = GroupedCredentials | undefined // can add other credential types here like verifiable credentials
/**
 * Type representing the basic state of a credential.
 * @typedef {Object} SingleCredentialState
 */
export type SingleCredentialState = {
  credentialName: credentialName
  keyAgentName: keyAgentName
  credential: storedCredential
}

/**
 * Constant representing the initial credential state
 * @typedef {Object}
 */
export const initialCredentialState: SingleCredentialState = {
  credentialName: '',
  keyAgentName: '',
  credential: undefined
}

/**
 * Type representing the aggregation of all credentials by name
 * @typedef {Object} CredentialStoreState
 */
export type CredentialStoreState = {
  credentials: Record<credentialName, SingleCredentialState>
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} CredentialsState
 */
export type CredentialState = {
  getState(): unknown
  state: CredentialStoreState

  ensureCredential: (
    credentialName: credentialName,
    keyAgentName: keyAgentName
  ) => void

  setCredential: (credentialState: SingleCredentialState) => void
  getCredential: (
    credentialName: credentialName
  ) => SingleCredentialState | typeof initialCredentialState

  removeCredential: (name: keyAgentName) => void
}

/**
 * The type of the store returned by createStore.
 * @typedef {Object} CredentialStores
 */
export type CredentialStores = CredentialState
