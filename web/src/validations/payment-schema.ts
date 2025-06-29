import { PaymentMethod } from '@/enums/payment-method'
import { z } from 'zod'

const round = (value: number) => Number(value.toFixed(2))

export const paymentSchema = z.object({
  amount: z
    .number()
    .positive({ message: 'Valor deve ser maior que zero.' })
    .transform(round),
  paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]], {
    message: 'Campo obrigatório',
  }),
  installments: z.number().optional(),
  change: z.number().optional(),
})
