import { z } from "zod"

export const SendFormSchema = z.object({
  to: z.string().length(55),
  amount: z.preprocess(Number, z.number().min(0.001)),
  fee: z.string(),
  memo: z.string().optional(),
})
