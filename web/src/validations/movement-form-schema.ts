import { z } from 'zod'
import { MeasureUnit } from '@/enums/measure-unit'

export const movementFormSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  type: z.enum(['Entrada', 'Saída']),
  products: z
    .array(
      z.object({
        name: z.string().min(1, 'Nome obrigatório'),
        unit: z.nativeEnum(MeasureUnit),
        quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
      }),
    )
    .min(1, 'Adicione pelo menos um produto'),
})
