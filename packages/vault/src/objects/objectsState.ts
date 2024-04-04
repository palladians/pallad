/**
 * @file Represents the state definitions related to objects (for example issued credentials).
 */
import { SearchQuery } from '../utils/utils'
export type ObjectName = string
export type StoredObject = undefined | object

/**
 * Type representing the basic state of an object.
 * @typedef {Object} SingleObjectState
 */
// TODO: remove "ObjectName" from type it is redundant
export type SingleObjectState = {
  objectName: ObjectName
  object: StoredObject
}

/**
 * Constant representing the initial object state
 * @typedef {Object}
 */
export const initialObjectState: SingleObjectState = {
  objectName: '',
  object: undefined
}

export type ObjectsStore = Record<ObjectName, SingleObjectState>
/**
 * Type representing the store's state and actions combined.
 * @typedef {Object} ObjectStore
 */
export type ObjectStore = {
  objects: ObjectsStore
  ensureObject: (objectName: ObjectName) => void
  setObject: (objectState: SingleObjectState) => void
  getObject: (
    objectName: ObjectName
  ) => SingleObjectState | typeof initialObjectState
  removeObject: (name: ObjectName) => void
  searchObjects(query: SearchQuery, props?: string[]): StoredObject[]
  clear: () => void
}
