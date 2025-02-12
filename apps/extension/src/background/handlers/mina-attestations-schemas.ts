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

const PublicKeySchema = z.string().length(55).startsWith("B62")

const MinaScanNetwork = z.enum(["devnet", "mainnet"])

const zkAppAccountSchema = z.object({
  address: PublicKeySchema,
  tokenId: z.string(),
  network: MinaScanNetwork,
})

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
        zkAppAccount: zkAppAccountSchema.optional(),
      })
      .strict(),
  ),
}).strict()
