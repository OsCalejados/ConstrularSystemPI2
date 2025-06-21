import { Product } from './product'

export interface OrderItem {
  id: number
  productId: number
  quantity: number
  unitPrice: number
  total: number
  product?: Product
}
