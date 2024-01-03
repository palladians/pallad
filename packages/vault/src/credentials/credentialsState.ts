/**
 * @file Represents the state definitions related to credentials specific to keyAgents & accounts.
 */

import { GroupedCredentials } from '@palladxyz/key-management'

import { KeyAgentName } from '../keyAgent'

export type CredentialName = string
export type StoredCredential = GroupedCredentials | undefined
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
 */
export type SingleCredentialState = {
  credentialName: CredentialName
  keyAgentName: KeyAgentName
  credential: StoredCredential
}

/**
 * Constant representing the initial credential state
 */
export const initialCredentialState: SingleCredentialState = {
  credentialName: '',
  keyAgentName: '',
  credential: undefined
}

export type CredentialState = {
  credentials: Record<CredentialName, SingleCredentialState>
}

/**
 * Type representing the store's state and actions combined.
 */
export type CredentialActions = {
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

export type CredentialStore = CredentialState & CredentialActions
