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
import { salesColumns } from '@/components/tables/sales-columns'

export default function Sales() {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['sales'],
    queryFn: () =>
      getOrders({
        type: 'SALE',
        includeCustomer: true,
      }),
  })

  if (!orders) return null

  return (
    <Page.Container>
      {/* Header */}
      <Page.Header>
        <Breadcrumb
          currentPage="Vendas"
          parents={[{ name: 'Pedidos', path: '/orders' }]}
        />
      </Page.Header>

      {/* Content */}
      <Page.Content>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Vendas</h2>
          <Button className="bg-primary gap-1 hover:bg-primary-hover" asChild>
            <Link href="/orders/sales/create">
              <PlusIcon size={20} weight="bold" className="text-white" />
              <span>Nova pedido</span>
            </Link>
          </Button>
        </div>
        <OrdersTable columns={salesColumns} data={orders} />
      </Page.Content>
    </Page.Container>
  )
}
