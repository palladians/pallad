import { z } from 'zod'

export const DelegateFormSchema = z.object({
  to: z.string().length(55),
  fee: z.string(),
  memo: z.string().optional()
})
