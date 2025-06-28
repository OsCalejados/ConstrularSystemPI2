'use client'

import { useParams } from 'next/navigation'

export default function Sale() {
  const { saleId } = useParams()

  return <div>Venda {saleId}</div>
}
