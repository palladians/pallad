import type { GroupedCredentials } from "@palladco/key-management"

import type { KeyAgentName } from "../keyAgent"
import type { SearchQuery } from "../utils/utils"

export type CredentialName = string
export type StoredCredential = GroupedCredentials | undefined

export type SingleCredentialState = {
  credentialName: CredentialName
  keyAgentName: KeyAgentName
  credential: StoredCredential
  lastSelected: number | undefined
}

export const initialCredentialState: SingleCredentialState = {
  credentialName: "",
  keyAgentName: "",
  credential: undefined,
  lastSelected: undefined,
}

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
