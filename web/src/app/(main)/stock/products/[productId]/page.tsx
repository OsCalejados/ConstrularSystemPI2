'use client'

import Breadcrumb from '@/components/ui/breadcrumb'

import { getProductById } from '@/services/product-service'
import { useParams, useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'
import { ProductFormData } from '@/types/validations'
import { productFormSchema } from '@/validations/product-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import ProductForm from '@/components/forms/product-form'
import LoadSpinner from '@/components/ui/load-spinner'

export default function ProductView() {
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const { productId } = useParams()
  const router = useRouter()

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onTouched',
    defaultValues: async () => {
      const data = await getProductById(productId as string)
      setIsLoading(false)
      setProduct(data)
      return {
        name: data.name,
        brand: data.brand,
        unit: data.unit,
        stockQuantity: data.stockQuantity,
        costPrice: data.costPrice,
        profitMargin: data.profitMargin,
        profit: data.profit,
        salePrice: data.salePrice,
      }
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    console.log(data)
  }

  if (isLoading || !product) return <LoadSpinner />

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

        <div className="mt-4">
          <FormProvider {...productForm}>
            <ProductForm onSubmit={onSubmit} readOnly={true} />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
