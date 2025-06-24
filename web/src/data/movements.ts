import { MovementType } from '@/enums/movement-type'
import { Movement } from '@/types/movement'
import { products } from './products'

export const movements: Movement[] = [
  {
    id: 1,
    description: 'Nota Tambasa',
    type: MovementType.IN,
    createdAt: '2024-02-11',
    items: [
      { product: products[1], quantity: 6, id: 1 }, // Ex: Chave de Roda 24mm
      { product: products[2], quantity: 50, id: 2 }, // Ex: Cabo flex 4mm SIL
    ],
  },
  {
    id: 2,
    description: 'Nota Maia',
    type: MovementType.IN,
    createdAt: '2024-02-11',
    items: [
      { product: products[3], quantity: 10, id: 3 }, // Ex: Cimento CP II
    ],
  },
  {
    id: 3,
    description: 'Nota Maia',
    type: MovementType.OUT,
    createdAt: '2024-02-11',
    items: [
      { product: products[4], quantity: 2, id: 4 }, // Ex: Cimento CP II
    ],
  },
]
