'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { productColumns } from '@/components/tables/product-columns'
import { ProductsTable } from '@/components/tables/products-table'
import { getProducts } from '@/services/product-service'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'

export default function Products() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (!products) return null

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb currentPage="Estoque" />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Produtos</h2>
          <Button className="bg-primary gap-1 hover:bg-primary-hover" asChild>
            <Link href="/stock/products/create">
              <PlusIcon size={20} weight="bold" className="text-white" />
              <span>Novo produto</span>
            </Link>
          </Button>
        </div>
        <ProductsTable columns={productColumns} data={products} />
      </Page.Content>
    </Page.Container>
  )
}
