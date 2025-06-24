import api from '@/lib/axios'
import { Movement } from '@/types/movement'
import { MovementFormData } from '@/types/validations'

export async function getMovements(): Promise<Movement[]> {
  const response = await api.get('stock_movements')
  return response.data
}

export async function getMovementById(
  movementId: number | string,
): Promise<Movement> {
  const response = await api.get(`stock_movements/${movementId}`)

  if (!response) {
    throw new Error('Movement not found')
  }

  return response.data
}

export async function createMovement(data: MovementFormData) {
  console.log(data)
  const response = await api.post('stock_movements', data)
  return response.data
}

export async function deleteMovement(movementId: number | string) {
  console.log('movement to be deleted: ', movementId)
  await api.delete(`stock_movements/${movementId}`)
}
