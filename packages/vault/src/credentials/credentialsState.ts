/**
 * @file Represents the state definitions related to credentials specific to keyAgents & accounts.
 */

import { GroupedCredentials } from '@palladxyz/key-management'

import { KeyAgentName } from '../keyAgent'

export type CredentialName = string
export type StoredCredential = GroupedCredentials | object | undefined // can add other credential types here like verifiable credentials
export interface SearchQuery {
  [key: string]: SearchValue
}
export type SearchValue =
  | string
  | number
  | boolean
  | Uint8Array
  | any[]
  | SearchQuery

/**
 * Type representing the basic state of a credential.
 * @typedef {Object} SingleCredentialState
 */
export type SingleCredentialState = {
  credentialName: CredentialName
  keyAgentName: KeyAgentName
  credential: StoredCredential
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
 * Type representing the store's state and actions combined.
 * @typedef {Object} CredentialsState
 */
export type CredentialState = {
  credentials: Record<CredentialName, SingleCredentialState>
  ensureCredential: (
    credentialName: CredentialName,
    keyAgentName: KeyAgentName
  ) => void
  setCredential: (credentialState: SingleCredentialState) => void
  getCredential: (
    credentialName: CredentialName
  ) => SingleCredentialState | typeof initialCredentialState
  removeCredential: (name: KeyAgentName) => void
  searchCredentials(query: SearchQuery, props?: string[]): StoredCredential[]
  clear: () => void
}
