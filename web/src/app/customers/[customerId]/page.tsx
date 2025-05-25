'use client'

import CustomerOptions from '@/components/dropdown-menus/customer-options'
import TabsProvider from '@/components/ui/tabs/tabs-context'
import Selectors from '@/components/ui/tabs/selectors'
import Content from '@/components/ui/tabs/content'
import Galery from '@/app/customers/[customerId]/_components/galery'
import Link from 'next/link'

import { Customer as TCustomer } from '@/types/customer'
import { getCustomerById } from '@/services/customer-service'
import { formatCurrency } from '@/utils/formatCurrency'
import { OrderStatus } from '@/enums/order-status'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/shadcnui/button'
import { useRef } from 'react'
import { Tabs } from '@/types/tabs'
import { Page } from '@/components/layout/page'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export default function Customer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { customerId } = useParams()

  const { data: customer } = useQuery<TCustomer>({
    queryKey: ['customerById'],
    queryFn: () => getCustomerById(customerId as string, true),
  })

  if (!customer || !customer.orders) return null

  const tabs = [
    {
      id: 'all',
      label: 'Todos',
      value: customer.orders.length,
    },
    {
      id: 'paid',
      label: 'Pagos',
      value: customer.orders.filter(
        (order) => order.status === OrderStatus.PAID,
      ).length,
    },
    {
      id: 'pending',
      label: 'Pendentes',
      value: customer.orders.filter(
        (order) => order.status === OrderStatus.PENDING,
      ).length,
    } as Tabs,
  ]

  return (
    <Page.Container ref={containerRef}>
      <Page.Header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">{customer.name}</h1>
          <div className="flex gap-2 justify-between items-center">
            <div className="border border-primary rounded-lg font-medium h-10 flex gap-1 items-center px-4 text-sm">
              <span>Saldo: </span>
              <span className="text-currency">
                {formatCurrency(customer.balance)}
              </span>
            </div>

            <Button
              className="bg-button-primary gap-1 hover:bg-button-primary-hover"
              asChild
            >
              <Link href={`/orders/create?customer=${customer.id}`}>
                <Plus size={20} weight="bold" className="text-white" />
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
      </Page.Header>

      <TabsProvider tabs={tabs}>
        <Selectors />
        <Content value="all">
          <Galery
            customerId={customerId as string}
            containerRef={containerRef}
          />
        </Content>

        <Content value="paid">
          <Galery
            customerId={customerId as string}
            containerRef={containerRef}
            status={OrderStatus.PAID}
          />
        </Content>

        <Content value="pending">
          <Galery
            customerId={customerId as string}
            containerRef={containerRef}
            status={OrderStatus.PENDING}
          />
        </Content>
      </TabsProvider>
    </Page.Container>
  )
}
