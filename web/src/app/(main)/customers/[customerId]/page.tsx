'use client'

import CustomerOptions from '@/components/dropdown-menus/customer-options'
import Link from 'next/link'

import { Customer as TCustomer } from '@/types/customer'
import { getCustomerById } from '@/services/customer-service'
import { formatCurrency } from '@/utils/format/format-currency'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/shadcnui/button'
import { useRef } from 'react'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Breadcrumb from '@/components/ui/breadcrumb'
import { getOrdersByCustomer } from '@/services/order-service'
import { Order } from '@/types/order'
import { customerOrdersColumns } from '@/components/tables/customer-orders-columns'
import { CustomerOrdersTable } from '@/components/tables/customer-orders-table'

export default function Customer() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const { customerId } = useParams()

  const { data: customer } = useQuery<TCustomer>({
    queryKey: ['customerById'],
    queryFn: () =>
      getCustomerById(customerId as string, {
        includeAddress: true,
      }),
  })

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orderByCustomerId'],
    queryFn: () =>
      getOrdersByCustomer(customerId as string, {
        includeCustomer: true,
      }),
  })

  if (!customer || !orders) return null

  return (
    <Page.Container ref={containerRef}>
      <Page.Header>
        <Breadcrumb
          currentPage={customer.name}
          parents={[
            {
              name: 'Clientes',
              path: '/customers',
            },
          ]}
        />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              className="w-8 h-8"
              variant="outline"
            >
              <CaretLeftIcon size={20} />
            </Button>
            <h2 className="font-medium">{customer.name}</h2>
          </div>
          <div className="flex gap-2 justify-between items-center">
            <div className="border border-primary rounded-lg font-medium h-10 flex gap-1 items-center px-4 text-sm">
              <span>Saldo: </span>
              <span className="text-currency">
                {formatCurrency(customer.balance)}
              </span>
            </div>

            <Button className="bg-primary hover:bg-primary-hover gap-1" asChild>
              <Link href={`/orders/create?customer=${customer.id}`}>
                <PlusIcon size={20} weight="bold" className="text-white" />
                <span>Novo pedido</span>
              </Link>
            </Button>

            <CustomerOptions
              customer={customer}
              variant="primary"
              showBalanceItem
              useLongLabel
            />
          </div>
        </div>

        <div className="h-px bg-border my-4" />

        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Pedidos</h3>
          <CustomerOrdersTable columns={customerOrdersColumns} data={orders} />
        </div>
      </Page.Content>
    </Page.Container>
  )
}
