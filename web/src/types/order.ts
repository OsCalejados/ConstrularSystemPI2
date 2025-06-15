import { OrderStatus } from '@/enums/order-status'
import { OrderType } from '@/enums/order-type'
import { Customer } from './customer'
import { Payment } from './payment'
import { Product } from './product'
import { User } from './user'

export interface Order {
  id: number
  notes: string
  type: OrderType
  status: OrderStatus
  total: number
  discount: number
  netTotal: number
  paid: boolean
  createdAt: Date
  customerId: number
  sellerId: number
  items?: Product[]
  seller?: User
  customer?: Customer
  payments?: Payment[]
}
