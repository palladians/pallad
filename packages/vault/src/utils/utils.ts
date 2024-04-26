export function matchesQuery(obj: any, query: any): boolean {
  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      if (typeof query[key] === "object" && !Array.isArray(query[key])) {
        if (
          !Object.prototype.hasOwnProperty.call(obj, key) ||
          !matchesQuery(obj[key], query[key])
        ) {
          return false
        }
      } else if (Array.isArray(obj[key]) && typeof query[key] === "string") {
        if (!obj[key].includes(query[key])) {
          return false
        }
      } else if (obj[key] !== query[key]) {
        return false
      }
    }
  }
  return true
}

export interface SearchQuery {
  [key: string]: SearchValue
}
export type SearchValue =
  | string
  | number
  | boolean
  | Uint8Array
  | any[]
  | SearchQuery
