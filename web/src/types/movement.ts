export type MovementStatus = 'Entrada' | 'Saída'

export interface Movement {
  id: number
  description: string
  status: MovementStatus
  date: string // ISO string
}
