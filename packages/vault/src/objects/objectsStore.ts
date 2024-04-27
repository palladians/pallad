import { produce } from "immer"
import { type StateCreator, create } from "zustand"

import { matchesQuery } from "../utils/utils"
import { DEFAULT_OBJECTS } from "./default"
import { type ObjectStore, initialObjectState } from "./objectsState"

export const objectSlice: StateCreator<ObjectStore> = (set, get) => ({
  objects: DEFAULT_OBJECTS,
  ensureObject: (objectName) => {
    set(
      produce((draft) => {
        draft.objects[objectName] = draft.objects[objectName] || {
          ...initialObjectState,
          objectName,
        }
      }),
    )
  },
  setObject: (objectState) => {
    const { objectName } = objectState
    set((current) =>
      produce(current, (draft) => {
        draft.objects[objectName] = {
          ...draft.objects[objectName],
          ...objectState,
        }
      }),
    )
  },
  getObject: (objectName) => {
    const { objects } = get()
    return objects[objectName] || initialObjectState
  },
  removeObject: (objectName) => {
    set(
      produce((draft) => {
        delete draft.objects[objectName]
      }),
    )
  },
  searchObjects: (query, props) => {
    // TODO: improve
    const { objects } = get()
    const objectsStatesArray = Object.values(objects)
    const objectsArray = objectsStatesArray.map((obj) => obj.object)
    const filteredObjects = objectsArray.filter((object) => {
      if (!object) {
        return false
      }
      return matchesQuery(object, query)
    })
    if (props?.length) {
      const arrayOfArrays = filteredObjects.map((objects) => {
        return props
          .filter((prop) => objects && prop in objects)
          .map((prop) => (objects as unknown as Record<string, any>)[prop])
      })
      return arrayOfArrays.flat()
    }
    return filteredObjects
  },
  clear: () => {
    set(
      produce((draft) => {
        draft.objects = {}
      }),
    )
  },
})

export const useObjectVault = create<ObjectStore>(objectSlice)
