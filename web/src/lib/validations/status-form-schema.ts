import { z } from 'zod'

export const statusFormSchema = z.object({
  status: z.enum(['PENDING', 'PAID'], { message: 'Selecione um status.' }),
})
