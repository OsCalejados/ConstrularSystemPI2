import { z } from 'zod'

export const balanceFormSchema = z.object({
  balance: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'Preço unitário deve ser maior que 0.' }),
})
