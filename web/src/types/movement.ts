import { MovementType } from '@/enums/movement-type'

export interface MovementItem {
  productId: number
  quantity: number
}

export interface Movement {
  id: number
  description: string
  type: MovementType
  items: MovementItem[]
  createdAt: string
}
