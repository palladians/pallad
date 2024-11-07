/**
 * @file Represents the state definitions related to objects (for example issued credentials).
 */
import type { Json } from "@mina-js/utils"
import type { SearchQuery } from "../utils/utils"
export type ObjectName = string
export type StoredObject = undefined | object

/**
 * Constant representing the initial object state
 * @typedef {Object}
 */
export const initialObjectState: Json = {
  objectName: "",
  object: {},
}

export type ObjectsStore = Record<ObjectName, Json>
/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} ObjectStore
 */
export type ObjectStore = {
  objects: ObjectsStore
  ensureObject: (objectName: ObjectName) => void
  setObject: (objectState: Json) => void
  getObject: (objectName: ObjectName) => Json | typeof initialObjectState
  removeObject: (name: ObjectName) => void
  searchObjects(query: SearchQuery, props?: string[]): StoredObject[]
  clearObjects: () => void
}
