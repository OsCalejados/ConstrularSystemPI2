import { OrderStatus } from '@/enums/order-status'
import { OrderType } from '@/enums/order-type'
import { OrderItem } from './order-item'
import { Customer } from './customer'
import { Payment } from './payment'
import { User } from './user'

export interface Order {
  id: number
  notes: string
  type: OrderType
  status: OrderStatus
  total: number
  discount: number
  subtotal: number
  paid: boolean
  createdAt: Date
  customerId: number
  sellerId: number
  items?: OrderItem[]
  seller?: User
  customer?: Customer
  payments?: Payment[]
}
