'use client'

import CustomPagination from '@/components/ui/pagination'
import Card from './card'

import { useRouter, useSearchParams } from 'next/navigation'
import { RefObject, useEffect } from 'react'
import { OrdersGalery } from '@/types/orders-galery'
import { useQuery } from '@tanstack/react-query'
import { getOrdersByCustomer } from '@/services/order-service'
import { OrderStatus } from '@/enums/order-status'

// interface GaleryProps {
//   data: OrdersGalery | undefined
//   page: number
//   containerRef: RefObject<HTMLDivElement>
// }

interface GaleryProps {
  customerId: string
  status?: OrderStatus
  containerRef: RefObject<HTMLDivElement>
}

export default function Galery({
  customerId,
  containerRef,
  status,
}: GaleryProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = 12

  const { data } = useQuery<OrdersGalery>({
    queryKey: ['galery', page],
    queryFn: () => getOrdersByCustomer(customerId, page, pageSize, status),
  })

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [page, containerRef])

  if (!data?.totalItems) {
    return (
      <div className="mt-4 flex items-center justify-center text-primary">
        <span>Nenhum pedido encontrado.</span>
      </div>
    )
  }

  const totalPages = Math.ceil(data.totalItems / Number(pageSize))

  return (
    <div>
      <div
        className="mt-4 grid grid-rows-2 gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        }}
      >
        {data.orders.map((order, index) => {
          const orderNumber = (page - 1) * pageSize + index + 1
          return <Card key={order.id} order={order} orderNumber={orderNumber} />
        })}
      </div>

      <CustomPagination
        firstPage={() => router.push('?page=1')}
        lastPage={() => router.push('?page=1')}
        nextPage={() => router.push(`?page=${Number(page) + 1}`)}
        previousPage={() => router.push(`?page=${Number(page) - 1}`)}
        setPageIndex={(p) => router.push(`?page=${p + 1}`)}
        pageIndex={Number(page) - 1}
        totalPages={totalPages}
        canNextPage={Number(page) < totalPages}
        canPreviousPage={Number(page) > 1}
        className="mt-4"
      />
    </div>
  )
}
