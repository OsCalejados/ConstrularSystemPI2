import { OrderStatus } from '@/enums/order-status'
import { itemSchema } from './item-schema'
import { OrderType } from '@/enums/order-type'
import { z } from 'zod'

export const installmentOrderSchema = z.object({
  type: z.literal(OrderType.INSTALLMENT),
  status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
  notes: z.string().optional(),
  customerId: z.number({ message: 'Campo obrigatório.' }),
  paid: z.boolean(),
  total: z.number().nonnegative(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item.'),
})
