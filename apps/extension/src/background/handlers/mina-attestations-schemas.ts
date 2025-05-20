import {
  PresentationRequestSchema,
  StoredCredentialSchema,
} from "mina-attestations/validation"
import { z } from "zod"

const RequestWithContext = z
  .object({
    context: z.record(z.any()).default({}).optional(),
  })
  .strict()

export const StorePrivateCredentialRequestParamsSchema =
  RequestWithContext.extend({
    method: z.literal("mina_storePrivateCredential"),
    params: z.array(StoredCredentialSchema as unknown as z.ZodType<any>),
  }).strict()

export const PresentationRequestParamsSchema = RequestWithContext.extend({
  method: z.literal("mina_requestPresentation"),
  params: z.array(
    z
      .object({
        presentationRequest:
          PresentationRequestSchema as unknown as z.ZodType<any>,
      })
      .strict(),
  ),
}).strict()
