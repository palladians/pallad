import { produce } from "immer"
import { type StateCreator, create } from "zustand"

import { matchesQuery } from "../utils/utils"
import { type ObjectStore, initialObjectState } from "./objectsState"

export const objectSlice: StateCreator<ObjectStore> = (set, get) => ({
  objects: {},
  ensureObject: (credentialId) => {
    set(
      produce((draft) => {
        draft.objects[credentialId] = draft.objects[credentialId] || {
          ...(initialObjectState as object),
          credentialId,
        }
      }),
    )
  },
  setObject: ({ credentialId, credential }) => {
    set((current) =>
      produce(current, (draft: any) => {
        draft.objects[credentialId] = {
          ...draft.objects[credentialId],
          ...(credential as object),
        }
      }),
    )
  },
  getObject: (credentialId) => {
    const { objects } = get()
    return objects[credentialId] || initialObjectState
  },
  removeObject: (credentialId) => {
    set(
      produce((draft) => {
        delete draft.objects[credentialId]
      }),
    )
  },
  searchObjects: ({ query, props }) => {
    const { objects } = get()
    const objectsStatesArray = Object.values(objects)
    const filteredObjects = objectsStatesArray.filter((object) => {
      if (!object) {
        return false
      }
      return matchesQuery(object, query)
    })
    if (props?.length) {
      const arrayOfArrays = filteredObjects.map((objects: any) => {
        return props
          .filter((prop) => objects && prop in objects)
          .map((prop) => (objects as unknown as Record<string, any>)[prop])
      })
      return arrayOfArrays.flat()
    }
    return filteredObjects
  },
  clearObjects: () => {
    set(
      produce((draft) => {
        draft.objects = {}
      }),
    )
  },
})

export const useObjectVault = create<ObjectStore>(objectSlice)
