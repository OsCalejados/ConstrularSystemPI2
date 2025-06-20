import { Movement } from '@/types/movement'
import { MeasureUnit } from '@/enums/measure-unit'
import { MovementFormData } from '@/types/validations'

// Mock data - substituir por chamadas de API quando o backend estiver pronto
const mockMovements: Movement[] = [
  {
    id: 1,
    description: 'Nota Tambasa',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [
      { name: 'Chave de Roda 24mm', unit: MeasureUnit.UN, quantity: 6 },
      { name: 'Cabo flex 4mm SIL', unit: MeasureUnit.MT, quantity: 50 },
    ],
  },
  {
    id: 2,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Cimento CP II', unit: MeasureUnit.UN, quantity: 10 }],
  },
  {
    id: 3,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Areia Média', unit: MeasureUnit.KG, quantity: 2 }],
  },
  {
    id: 4,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Brita 1', unit: MeasureUnit.KG, quantity: 1 }],
  },
  {
    id: 5,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Tijolo 6 furos', unit: MeasureUnit.UN, quantity: 500 }],
  },
  {
    id: 6,
    description: 'Nota Tambasa',
    status: 'Saída',
    type: 'Saída',
    date: '2024-02-11',
    products: [{ name: 'Cimento CP II', unit: MeasureUnit.UN, quantity: 2 }],
  },
  {
    id: 7,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Areia Média', unit: MeasureUnit.KG, quantity: 1 }],
  },
  {
    id: 8,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [
      { name: 'Cabo flex 4mm SIL', unit: MeasureUnit.MT, quantity: 20 },
    ],
  },
  {
    id: 9,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [
      { name: 'Chave de Roda 24mm', unit: MeasureUnit.UN, quantity: 1 },
    ],
  },
  {
    id: 10,
    description: 'Nota Maia',
    status: 'Saída',
    type: 'Saída',
    date: '2024-02-11',
    products: [{ name: 'Tijolo 6 furos', unit: MeasureUnit.UN, quantity: 100 }],
  },
  {
    id: 11,
    description: 'Nota Maia',
    status: 'Entrada',
    type: 'Entrada',
    date: '2024-02-11',
    products: [{ name: 'Brita 1', unit: MeasureUnit.KG, quantity: 3 }],
  },
  {
    id: 12,
    description: 'Nota Maia',
    status: 'Saída',
    type: 'Saída',
    date: '2024-02-11',
    products: [{ name: 'Areia Média', unit: MeasureUnit.KG, quantity: 1 }],
  },
]

export async function getMovements(): Promise<Movement[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockMovements
}

export async function getMovementById(
  movementId: number | string,
): Promise<Movement> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const movement = mockMovements.find((m) => m.id === Number(movementId))
  if (!movement) {
    throw new Error('Movement not found')
  }
  return movement
}

export async function createMovement(
  data: MovementFormData,
): Promise<Movement> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newMovement: Movement = {
    id: mockMovements.length + 1,
    description: data.description,
    status: data.type,
    type: data.type,
    date: new Date().toISOString().split('T')[0],
    products: data.products,
  }

  mockMovements.unshift(newMovement)
  return newMovement
}

export async function deleteMovement(
  movementId: number | string,
): Promise<void> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockMovements.findIndex((m) => m.id === Number(movementId))
  if (index === -1) {
    throw new Error('Movement not found')
  }

  mockMovements.splice(index, 1)
}

// TODO: Implementar quando o backend estiver pronto
// export async function createMovement(movementData: any) {
//   const response = await api.post('movements', movementData)
//   return response.data
// }

// export async function deleteMovement(movementId: number | string) {
//   await api.delete(`movements/${movementId}`)
// }
