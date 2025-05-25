import { z } from 'zod'

export const balanceFormSchema = z.object({
  balance: z.string(),
})
