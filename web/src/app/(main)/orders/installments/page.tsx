'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { Button } from '@/components/shadcnui/button'
import { Order } from '@/types/order'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { Page } from '@/components/layout/page'
import { getOrders } from '@/services/order-service'
import { useQuery } from '@tanstack/react-query'
import { OrdersTable } from '@/components/tables/orders-table'
import { installmentOrdersColumns } from '@/components/tables/installment-orders-culumns'
import { OrderType } from '@/enums/order-type'

export default function Orders() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () =>
      getOrders({
        includeCustomer: true,
        type: OrderType.INSTALLMENT,
      }),
  })

  if (!orders) return null

  return (
    <Page.Container>
      {/* Header */}
      <Page.Header>
        <Breadcrumb currentPage="Pedidos a prazo" />
      </Page.Header>

      {/* Content */}
      <Page.Content>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Pedidos a prazo</h2>
          <Button className="bg-primary gap-1 hover:bg-primary-hover" asChild>
            <Link href="/orders/installments/create">
              <PlusIcon size={20} weight="bold" className="text-white" />
              <span>Novo pedido</span>
            </Link>
          </Button>
        </div>
        <OrdersTable columns={installmentOrdersColumns} data={orders} />
      </Page.Content>
    </Page.Container>
  )
}
