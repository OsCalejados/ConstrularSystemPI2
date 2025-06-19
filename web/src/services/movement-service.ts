import { Movement } from '@/types/movement'

// Mock data - substituir por chamadas de API quando o backend estiver pronto
const mockMovements: Movement[] = [
  { id: 1, description: 'Nota Tambasa', status: 'Entrada', date: '2024-02-11' },
  { id: 2, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 3, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 4, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 5, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 6, description: 'Nota Tambasa', status: 'Saída', date: '2024-02-11' },
  { id: 7, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 8, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 9, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 10, description: 'Nota Maia', status: 'Saída', date: '2024-02-11' },
  { id: 11, description: 'Nota Maia', status: 'Entrada', date: '2024-02-11' },
  { id: 12, description: 'Nota Maia', status: 'Saída', date: '2024-02-11' },
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

// TODO: Implementar quando o backend estiver pronto
// export async function createMovement(movementData: any) {
//   const response = await api.post('movements', movementData)
//   return response.data
// }

// export async function updateMovement(movementId: number | string, movementData: any) {
//   await api.put(`movements/${movementId}`, movementData)
// }

// export async function deleteMovement(movementId: number | string) {
//   await api.delete(`movements/${movementId}`)
// }
