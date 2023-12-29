export interface JsonSerializer {
  stringify: (obj: any) => string
  parse: (obj: string) => unknown
}

export const defaultJsonSerializer: JsonSerializer = {
  stringify: JSON.stringify,
  parse: JSON.parse
}
