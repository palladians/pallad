import type {
  MinaProviderClient,
  ProviderRequestParams,
  ResultType,
} from "@mina-js/providers"
import { RequestWithContext } from "@mina-js/providers"
import { FieldSchema } from "@mina-js/utils"
import { z } from "zod"

export const FieldsAndPassphraseSchema = z
  .object({
    fields: z.array(FieldSchema),
    passphrase: z.string(),
  })
  .strict()

export const SignFieldsWithPassphraseRequestParams = RequestWithContext.extend({
  method: z.literal("mina_signFieldsWithPassphrase"),
  params: z.array(FieldsAndPassphraseSchema),
}).strict()

export type ExtendedProviderRequestParams =
  | ProviderRequestParams
  | z.infer<typeof SignFieldsWithPassphraseRequestParams>

// export const SignFieldsWithPassphraseReturn = z.object({
//   method: z.literal("mina_signFieldsWithPassphrase"),
//   result: SignedFieldsSchema,
// }).strict();

type ExtendedMinaProviderRequest = <M extends string>(
  args: Extract<ExtendedProviderRequestParams, { method: M }>,
) => Promise<ResultType<M>>

export interface ExtendedMinaProviderClient
  extends Omit<MinaProviderClient, "request"> {
  request: ExtendedMinaProviderRequest
}
