import { z } from "zod"

export const SendFormSchema = z.object({
  to: z.string().length(55),
  amount: z.coerce.number().min(0.001).optional(),
  fee: z.string(),
  memo: z.string().optional(),
})

export type SendFormSchemaProps = z.infer<typeof SendFormSchema>
