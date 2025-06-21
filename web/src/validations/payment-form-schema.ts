import { PaymentMethod } from '@/enums/payment-method.'
import { z } from 'zod'

export const paymentFormSchema = z.object({
  orderId: z.number(),
  amount: z.number().positive({ message: 'Valor deve ser maior que zero.' }),
  paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]]),
  installments: z.number().optional(),
  change: z.number().optional(),
})
