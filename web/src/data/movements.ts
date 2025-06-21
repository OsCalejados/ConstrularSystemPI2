import { MovementType } from '@/enums/movement-type'
import { Movement } from '@/types/movement'

export const movements: Movement[] = [
  {
    id: 1,
    description: 'Nota Tambasa',
    type: MovementType.IN,
    createdAt: '2024-02-11',
    items: [
      { productId: 1, quantity: 6 }, // Ex: Chave de Roda 24mm
      { productId: 2, quantity: 50 }, // Ex: Cabo flex 4mm SIL
    ],
  },
  {
    id: 2,
    description: 'Nota Maia',
    type: MovementType.IN,
    createdAt: '2024-02-11',
    items: [
      { productId: 3, quantity: 10 }, // Ex: Cimento CP II
    ],
  },
  {
    id: 3,
    description: 'Nota Maia',
    type: MovementType.OUT,
    createdAt: '2024-02-11',
    items: [
      { productId: 3, quantity: 2 }, // Ex: Cimento CP II
    ],
  },
]
