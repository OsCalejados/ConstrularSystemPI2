import { useParams } from 'next/navigation'

export default function CreateMovement() {
  const { movementId } = useParams()

  return <div>Visualização da movimentação de id {movementId}</div>
}
