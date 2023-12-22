import { z } from 'zod'

export const NewAddressFormSchema = z.object({
  name: z.string().min(1).max(48),
  address: z.string().length(55)
})
