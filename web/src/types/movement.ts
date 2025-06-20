export type MovementStatus = 'Entrada' | 'Saída'

export interface MovementProduct {
  name: string
  unit: string
  quantity: number
}

export interface Movement {
  id: number
  description: string
  status: MovementStatus
  type: MovementStatus // compatível com MovementFormData
  date: string // ISO string
  products: MovementProduct[]
}
