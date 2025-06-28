import { itemSchema } from './item-schema'
import { OrderType } from '@/enums/order-type'
import { z } from 'zod'

const round = (value: number) => Number(value.toFixed(2))

export const saleOrderSchema = z.object({
  type: z.literal(OrderType.SALE),
  notes: z.string().optional(),
  customerId: z.number({ message: 'Campo obrigatório.' }),
  total: z.number().nonnegative().transform(round),
  subtotal: z.number().nonnegative().transform(round),
  discount: z.number().nonnegative().default(0).transform(round),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item.'),
  useBalance: z.boolean().default(false),
})
