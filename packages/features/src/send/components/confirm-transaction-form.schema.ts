import { z } from 'zod'

import { passwordSchema } from '@/common/lib/validation'

export const ConfirmTransactionSchema = z.object({
  spendingPassword: passwordSchema
})
