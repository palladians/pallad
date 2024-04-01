import { produce } from 'immer'
import { create, StateCreator } from 'zustand'

import { matchesQuery } from '../utils/utils'
import { initialObjectState, ObjectStore } from './objectsState'

export const objectSlice: StateCreator<ObjectStore> = (set, get) => ({
  objects: {},
  ensureObject: (objectName) => {
    set(
      produce((state) => {
        if (!state.objects?.[objectName]) {
          state.objects[objectName] = {
            ...initialObjectState,
            objectName: objectName
          }
        }
      })
    )
  },
  setObject: (objectState) => {
    const { objectName } = objectState
    set(
      produce((state) => {
        state.objects[objectName] = objectState
      })
    )
  },
  getObject: (objectName) => {
    const { objects } = get()
    return objects[objectName] || initialObjectState
  },
  removeObject: (objectName) => {
    set(
      produce((state) => {
        delete state.objects[objectName]
      })
    )
  },
  searchObjects: (query, props) => {
    const { objects } = get()
    const objectsStatesArray = Object.values(objects)
    const objectsArray = objectsStatesArray.map((obj) => obj.object)
    const filteredObjects = objectsArray.filter((object) => {
      if (!object) {
        return false
      }
      return matchesQuery(object, query)
    })
    if (props && props.length) {
      const arrayOfArrays = filteredObjects.map((objects) => {
        return props
          .filter((prop) => objects && prop in objects)
          .map((prop) => (objects as unknown as Record<string, any>)[prop])
      })
      return arrayOfArrays.flat()
    } else {
      return filteredObjects
    }
  },
  clear: () => {
    set(
      produce((state) => {
        state.objects = {}
      })
    )
  }
})

export const useObjectVault = create<ObjectStore>(objectSlice)
