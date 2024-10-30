import { z } from "zod"

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
)

export const OriginSchema = z.string().url()

export type Origin = z.infer<typeof OriginSchema>

export const RequestSchema = z
  .object({
    origin: OriginSchema,
  })
  .strict()

export type RequestData = z.infer<typeof RequestSchema>

export const signFieldsRequestSchema = RequestSchema.extend({
  fields: z.array(z.coerce.number()),
})

export type SignFieldsData = z.infer<typeof signFieldsRequestSchema>

export const signMessageRequestSchema = RequestSchema.extend({
  message: z.string(),
})

export type SignMessageData = z.infer<typeof signMessageRequestSchema>

export const createNullifierRequestSchema = RequestSchema.extend({
  message: z.array(z.coerce.number()),
})

export type CreateNullifierData = z.infer<typeof createNullifierRequestSchema>

export const publicKeySchema = z.string().length(55)

export const transactionSchema = z
  .object({
    to: publicKeySchema,
    from: publicKeySchema,
    fee: z.coerce.number(),
    nonce: z.coerce.number(),
    memo: z.string().optional(),
    validUntil: z.coerce.number().optional(),
    amount: z.coerce.number().optional(),
  })
  .strict()

export const signatureSchema = z
  .object({
    field: z.string(),
    scalar: z.string(),
  })
  .strict()

export const signedTransactionSchema = z.object({
  data: transactionSchema,
  publicKey: publicKeySchema,
  signature: signatureSchema,
})

export const signTransactionRequestSchema = RequestSchema.extend({
  transaction: transactionSchema.strict(),
})

export type SignTransactionData = z.infer<typeof signTransactionRequestSchema>

export const sendTransactionRequestSchema = RequestSchema.extend({
  signedTransaction: signedTransactionSchema.strict(),
  transactionType: z.enum(["payment", "delegation", "zkapp"]),
})

export type SendTransactionData = z.infer<typeof sendTransactionRequestSchema>

export const setStateRequestSchema = RequestSchema.extend({
  objectName: z.string(),
  object: jsonSchema,
})

export type SetStateData = z.infer<typeof setStateRequestSchema>

export const getStateRequestSchema = RequestSchema.extend({
  query: jsonSchema,
  props: z.array(z.string()),
})

export type GetStateData = z.infer<typeof getStateRequestSchema>
