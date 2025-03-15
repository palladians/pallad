import type {
  MinaProviderClient,
  ProviderRequestParams,
  ResultType,
} from "@mina-js/providers"
import { FieldSchema } from "@mina-js/utils"
import { z } from "zod"

// Schema for the fields and passphrase parameters
export const FieldsAndPassphraseSchema = z
  .object({
    fields: z.array(FieldSchema as any),
    passphrase: z.string(),
  })
  .strict()

// Complete request schema for mina_signFieldsWithPassphrase
export const SignFieldsWithPassphraseRequestParams = z
  .object({
    method: z.literal("mina_signFieldsWithPassphrase"),
    params: z.array(FieldsAndPassphraseSchema),
    context: z.record(z.string(), z.any()).optional().default({}),
  })
  .strict()

export type ExtendedProviderRequestParams =
  | ProviderRequestParams
  | z.infer<typeof SignFieldsWithPassphraseRequestParams>

type ExtendedMinaProviderRequest = <M extends string>(
  args: Extract<ExtendedProviderRequestParams, { method: M }>,
) => Promise<ResultType<M>>

export interface ExtendedMinaProviderClient
  extends Omit<MinaProviderClient, "request"> {
  request: ExtendedMinaProviderRequest
}
