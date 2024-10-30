import type { Json } from "@mina-js/utils"

export function hasQueryAndProps(obj: any) {
  return obj && typeof obj === "object" && "query" in obj && "props" in obj
}

export function hasObjectProps(obj: any): obj is Json {
  // Check for the existence of both 'objectName' and 'object' properties
  return (
    obj && typeof obj === "object" && "objectName" in obj && "object" in obj
  )
}
