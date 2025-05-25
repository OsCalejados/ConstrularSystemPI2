import { z } from 'zod'

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Insira um nome com pelo menos 2 caracteres.' }),
  phone: z.string(),
  email: z.union([
    z.literal(''),
    z.string().email({ message: 'Digite um e-mail válido' }),
  ]),
  district: z.string(),
  street: z.string(),
  number: z
    .string()
    .max(6, { message: 'O campo "Número" aceita no máximo 6 caracteres.' }),
  complement: z.string(),
  landmark: z.string(),
})
