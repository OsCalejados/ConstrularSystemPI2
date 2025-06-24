import { MovementType } from '@/enums/movement-type'
import { Product } from './product'

export interface MovementItem {
  id: number
  quantity: number
  product: Product
}

export interface Movement {
  id: number
  description: string
  type: MovementType
  items: MovementItem[]
  createdAt: string
}
