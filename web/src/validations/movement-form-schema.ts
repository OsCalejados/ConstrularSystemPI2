import { MovementType } from '@/enums/movement-type'
import { z } from 'zod'

export const movementFormSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  type: z.enum(Object.values(MovementType) as [string, ...string[]]),
  items: z
    .array(
      z.object({
        productId: z
          .number({ message: 'Campo obrigatório.' })
          .nullable()
          .refine((val) => val !== null, {
            message: 'Produto obrigatório',
          }),
        quantity: z
          .number({ message: 'Campo obrigatório.' })
          .positive({ message: 'Quantidade deve ser maior que 0.' }),
      }),
    )
    .min(1, 'Adicione pelo menos um produto'),
})
