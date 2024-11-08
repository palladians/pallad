/**
 * @file Represents the state definitions related to credentials specific to keyAgents & accounts.
 */

import type { GroupedCredentials } from "@palladco/key-management"

import type { KeyAgentName } from "../keyAgent"
import type { SearchQuery } from "../utils/utils"

export type CredentialName = string
export type StoredCredential = GroupedCredentials | undefined

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
  credentialName: "",
  keyAgentName: "",
  credential: undefined,
}

/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} CredentialsState
 */
export type CredentialStore = {
  credentials: Record<CredentialName, SingleCredentialState>
  ensureCredential: (
    credentialName: CredentialName,
    keyAgentName: KeyAgentName,
  ) => void
  setCredential: (credentialState: SingleCredentialState) => void
  getCredential: (
    credentialName: CredentialName,
  ) => SingleCredentialState | typeof initialCredentialState
  removeCredential: (name: KeyAgentName) => void
  searchCredentials(query: SearchQuery, props?: string[]): StoredCredential[]
  clearCredentials: () => void
}
