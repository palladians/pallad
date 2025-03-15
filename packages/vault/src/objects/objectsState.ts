import type { Json } from "@mina-js/utils"
import type { SearchQuery } from "../utils/utils"
export type CredentialId = string
export type StoredObject = undefined | object

export const initialObjectState: Json = {
  credentialId: "",
  credential: {},
}

export type ObjectsStore = Record<CredentialId, Json>

export type ObjectStore = {
  objects: ObjectsStore
  ensureObject: (credentialId: CredentialId) => void
  setObject: (props: { credentialId: CredentialId; credential: Json }) => void
  getObject: (credentialId: CredentialId) => Json | typeof initialObjectState
  removeObject: (credentialId: CredentialId) => void
  searchObjects(props: {
    query: SearchQuery
    props: string[] | undefined
  }): StoredObject[]
  clearObjects: () => void
}
