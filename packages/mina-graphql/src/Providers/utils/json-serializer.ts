import JSONbig from 'json-bigint'

export const defaultJsonSerializer = JSONbig({ useNativeBigInt: true })
