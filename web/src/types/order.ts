import { OrderStatus } from '@/enums/order-status'
import { Customer } from './customer'
import { Payment } from './payment'
import { Item } from './item'

export interface Order {
  id: number
  status: OrderStatus
  notes?: string
  createdAt: string
  items: Item[]
  customer: Customer
  payments?: Payment[]
}
