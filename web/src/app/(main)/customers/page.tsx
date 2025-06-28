'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { costumerColumns } from '@/components/tables/customers-columns'
import { CustomersTable } from '@/components/tables/customers-table'
import { getCustomers } from '@/services/customer-service'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'

export default function Customers() {
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  if (!customers) return null

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb currentPage="Clientes" />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Clientes</h2>
          <Button className="bg-primary gap-1 hover:bg-primary-hover" asChild>
            <Link href="/customers/create">
              <PlusIcon size={20} weight="bold" className="text-white" />
              <span>Novo cliente</span>
            </Link>
          </Button>
        </div>
        <CustomersTable columns={costumerColumns} data={customers} />
      </Page.Content>
    </Page.Container>
  )
}
