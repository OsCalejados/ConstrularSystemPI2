import { useParams } from 'next/navigation'

export default function Product() {
  const { productId } = useParams()

  return (
    <div>
      <div>Produto {productId}</div>
    </div>
  )
}
