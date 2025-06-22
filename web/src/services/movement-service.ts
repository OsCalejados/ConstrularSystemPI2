import { movements } from '@/data/movements'
import { Movement } from '@/types/movement'
import { MovementFormData } from '@/types/validations'

export async function getMovements(): Promise<Movement[]> {
  return movements
}

export async function getMovementById(
  movementId: number | string,
): Promise<Movement> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const movement = movements.find((m) => m.id === Number(movementId))

  if (!movement) {
    throw new Error('Movement not found')
  }

  return movement
}

export async function createMovement(data: MovementFormData) {
  console.log(data)
  // const response = await api.post('movements', movementData)
  //   return response.data
}

export async function deleteMovement(movementId: number | string) {
  console.log('movement to be deleted: ', movementId)
  // await api.delete(`movements/${movementId}`)
}
