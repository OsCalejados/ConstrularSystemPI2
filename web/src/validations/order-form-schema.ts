import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório.' }),
  unit: z.enum(['KG', 'MT', 'UN'], {
    message: 'Selecione uma opção.',
  }),
  quantity: z
    .number({ message: 'Campo obrigatório.' })
    .positive({ message: 'A quantidade deve ser maior que 0.' }),
})

export const paymentSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero.'),
  method: z.enum(['CASH', 'CREDIT_CARD', 'PIX'], {
    message: 'Selecione um método de pagamento.',
  }),
})

export const orderFormSchema = z.object({
  items: z
    .array(itemSchema)
    .nonempty({ message: 'Pelo menos um item deve ser adicionado.' }),
  notes: z.string(),
  customerId: z.string({ message: 'Campo obrigatório.' }),
  status: z.enum(['PENDING', 'PAID'], { message: 'Selecione um status.' }),
})
