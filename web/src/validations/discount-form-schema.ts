import { z } from 'zod'

export const discountFormSchema = z.object({
  percentage: z
    .number({ invalid_type_error: 'Informe um número válido' })
    .min(0, 'O desconto não pode ser menor que 0%')
    .max(100, 'O desconto não pode ser maior que 100%')
    .optional()
    .nullable(),

  amount: z
    .number({ invalid_type_error: 'Informe um valor válido' })
    .min(0, 'O desconto não pode ser menor que R$ 0,00')
    .optional()
    .nullable(),
})
