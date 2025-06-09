'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import Link from 'next/link'

import { getProductById } from '@/services/product-service'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { formatCurrency } from '@/utils/format-currency'
import { Label } from '@/components/shadcnui/label'
import { Input } from '@/components/shadcnui/input'

export default function ProductView() {
  const { productId } = useParams()
  const router = useRouter()

  const { data: product } = useQuery<Product>({
    queryKey: ['productById', productId],
    queryFn: () => getProductById(productId as string),
  })

  if (!product) return null

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage={product.name}
          parents={[
            {
              name: 'Estoque',
              path: '/products',
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
            <h2 className="font-medium">Visualizar Produto</h2>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary-hover" asChild>
              <Link href={`/products/edit/${product.id}`}>
                <span>Editar</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Dados do produto */}
            <div className="border-primary flex flex-col gap-4 flex-[2] border p-6 pt-4 rounded-xl text-primary">
              <h4 className="font-medium">Dados do produto</h4>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={product.name}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={product.brand}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unidade de medida</Label>
                  <Input
                    id="unit"
                    value={product.unit}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="stockQuantity">Estoque</Label>
                  <Input
                    id="stockQuantity"
                    value={product.stockQuantity}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Gerenciar preço */}
            <div className="border-primary flex flex-col gap-4 flex-[1] border p-6 pt-4 rounded-xl text-primary">
              <h4 className="font-medium">Gerenciar preço</h4>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="costPrice">Preço de custo</Label>
                  <Input
                    id="costPrice"
                    value={formatCurrency(product.costPrice)}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="profitMargin">Margem (%)</Label>
                  <Input
                    id="profitMargin"
                    value={`${product.profitMargin}%`}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="salePrice">Preço de venda</Label>
                  <Input
                    id="salePrice"
                    value={formatCurrency(product.salePrice)}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="profit">Lucro</Label>
                  <Input
                    id="profit"
                    value={formatCurrency(product.profit)}
                    className="mt-1 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
