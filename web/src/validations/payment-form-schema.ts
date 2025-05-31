import { z } from 'zod'

export const paymentFormSchema = z.object({
  value: z.string(),
})
