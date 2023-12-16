import { z } from 'zod'

export const ConfirmTransactionSchema = z.object({
  spendingPassword: z.string().min(1)
})
