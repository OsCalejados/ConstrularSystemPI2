import { OrderType } from '@/enums/order-type'
import { itemSchema } from './item-schema'
import { z } from 'zod'
import { OrderStatus } from '@/enums/order-status'

export const quoteSchema = z.object({
  type: z.literal(OrderType.QUOTE),
  notes: z.string().optional(),
  customerId: z.string().optional(),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item.'),
  status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
  paid: z.literal(false),
  total: z.number().nonnegative(),
  netTotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
})
