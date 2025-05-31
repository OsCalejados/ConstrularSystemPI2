import { useParams } from 'next/navigation'

export default function EditProduct() {
  const { productId } = useParams()

  return (
    <div>
      <div>Editar produto {productId}</div>
    </div>
  )
}
