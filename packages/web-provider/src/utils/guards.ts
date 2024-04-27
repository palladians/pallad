import type { SingleObjectState } from "@palladxyz/vault"

import type { RequestArguments } from "../web-provider-types"

export function hasQueryAndProps(obj: any): obj is RequestArguments {
  return obj && typeof obj === "object" && "query" in obj && "props" in obj
}

export function hasObjectProps(obj: any): obj is SingleObjectState {
  // Check for the existence of both 'objectName' and 'object' properties
  return (
    obj && typeof obj === "object" && "objectName" in obj && "object" in obj
  )
}
