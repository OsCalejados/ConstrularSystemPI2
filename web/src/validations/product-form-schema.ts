import { MeasureUnit } from '@/enums/measure-unit'
import { z } from 'zod'

export const productFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Insira um nome com pelo menos 2 caracteres.' }),
  brand: z
    .string()
    .min(2, { message: 'Insira uma marca com pelo menos 2 caracteres.' }),
  unit: z.enum(Object.values(MeasureUnit) as [string, ...string[]], {
    message: 'Selecione uma unidade válida.',
  }),
  stockQuantity: z
    .number({ message: 'Campo obrigatório.' })
    .min(0, { message: 'A quantidade deve ser maior ou igual a 0.' }),
  costPrice: z
    .number({ message: 'Campo obrigatório.' })
    .min(0, { message: 'O preço de custo deve ser maior que 0.' }),
  profitMargin: z
    .number({ message: 'Campo obrigatório.' })
    .min(0, { message: 'A margem deve ser maior ou igual a 0.' })
    .max(100, { message: 'A margem deve ser menor ou igual a 100%.' }),
  profit: z.number().optional(),
  salePrice: z.number().optional(),
})
