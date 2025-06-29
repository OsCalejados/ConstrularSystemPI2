import { z } from 'zod'

export const itemSchema = z.object({
  productId: z
    .number({ message: 'Campo obrigatório.' })
    .optional()
    .refine((val) => val !== undefined, {
      message: 'Produto obrigatório',
    }),
  quantity: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'Quantidade deve ser maior que 0.' }),
  unitPrice: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'Preço unitário deve ser maior que 0.' }),
  total: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'Total deve ser maior que 0.' }),
})
