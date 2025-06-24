'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { movementColumns } from '@/components/tables/movement-columns'
import { MovementsTable } from '@/components/tables/movements-table'
import { getMovements } from '@/services/movement-service'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { Movement } from '@/types/movement'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'

import LoadSpinner from '@/components/ui/load-spinner'

export default function Movements() {
  const {
    data: movements,
    isLoading,
    isError,
  } = useQuery<Movement[]>({
    queryKey: ['movements'],
    queryFn: getMovements,
  })

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Header>
          <Breadcrumb currentPage="Movimentações" />
        </Page.Header>
        <Page.Content>
          <LoadSpinner />
        </Page.Content>
      </Page.Container>
    )
  }

  if (isError) {
    return (
      <Page.Container>
        <Page.Header>
          <Breadcrumb currentPage="Movimentações" />
        </Page.Header>
        <Page.Content>
          <p>Erro ao carregar movimentações.</p>
        </Page.Content>
      </Page.Container>
    )
  }

  if (!movements) {
    return (
      <Page.Container>
        <Page.Header>
          <Breadcrumb currentPage="Movimentações" />
        </Page.Header>
        <Page.Content>
          <p>Nenhum dado de movimentação disponível.</p>
        </Page.Content>
      </Page.Container>
    )
  }

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb currentPage="Movimentações" />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Movimentações</h2>
          <Button className="bg-primary gap-1 hover:bg-primary-hover" asChild>
            <Link href="/stock/movements/create">
              <PlusIcon size={20} weight="bold" className="text-white" />
              <span>Nova movimentação</span>
            </Link>
          </Button>
        </div>
        <MovementsTable columns={movementColumns} data={movements} />
      </Page.Content>
    </Page.Container>
  )
}
