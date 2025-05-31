import { z } from 'zod'

const itemSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório.' }),
  unit: z.enum(['KG', 'MT', 'UN'], {
    message: 'Selecione uma opção.',
  }),
  quantity: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'A quantidade deve ser maior que 0.' }),
})

export const orderFormSchema = z.object({
  items: z
    .array(itemSchema)
    .nonempty({ message: 'Pelo menos um item deve ser adicionado.' }),
  notes: z.string(),
  customerId: z.string({ message: 'Campo obrigatório.' }),
  status: z.enum(['PENDING', 'PAID'], { message: 'Selecione um status.' }),
})
