import { paymentSchema } from './payment-schema'
import { itemSchema } from './item-schema'
import { OrderType } from '@/enums/order-type'
import { z } from 'zod'

export const saleSchema = z.object({
  type: z.literal(OrderType.SALE),
  notes: z.string().optional(),
  customerId: z.number(),
  status: z.literal('COMPLETED'),
  paid: z.literal(true),
  total: z.number().nonnegative(),
  netTotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item.'),
  payments: z.array(paymentSchema).length(1, 'É necessário um pagamento.'),
})
