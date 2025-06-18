'use client'
import { useParams } from 'next/navigation'

export default function CreateMovement() {
  const { movementId } = useParams()

  return <div>Edição da movimentação de id {movementId}</div>
}
