import type { MinaSignablePayload } from "@palladco/key-management"
import type { BorrowedTypes } from "@palladco/mina-core"

export const serializeField = (field: BorrowedTypes.Field) => {
  if (typeof field === "bigint" || typeof field === "number") {
    return field.toString()
  }
  return field
}

export const serializeGroup = (group: BorrowedTypes.Group) => ({
  x: serializeField(group.x),
  y: serializeField(group.y),
})

export const serializeUInt = (
  uint: BorrowedTypes.UInt64 | BorrowedTypes.UInt32,
) => {
  if (typeof uint === "bigint" || typeof uint === "number") {
    return uint.toString()
  }
  return uint
}

export const serializeTransaction = (transaction: MinaSignablePayload) => {
  const serializeObject = (obj: any): any => {
    // Iterate through all properties of the object
    for (const key in obj) {
      // Use Object.prototype.hasOwnProperty.call to check if the key is a direct property of the object
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        // Check if the property is an object and not null, to avoid trying to serialize non-serializable types
        if (typeof value === "object" && value !== null) {
          // If it's an object, we recursively call serializeObject
          obj[key] = serializeObject(value)
        } else if (typeof value === "bigint" || typeof value === "number") {
          // Apply serialization for bigint or number types
          obj[key] = serializeUInt(value)
        }
      }
    }
    return obj
  }

  // Clone the transaction object to avoid mutating the original object
  const clonedTransaction = JSON.parse(JSON.stringify(transaction))
  return serializeObject(clonedTransaction)
}
