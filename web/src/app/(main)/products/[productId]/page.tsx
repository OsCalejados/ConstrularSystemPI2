'use client'

import Breadcrumb from '@/components/ui/breadcrumb'

import { getProductById } from '@/services/product-service'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { useEffect } from 'react'
import { ProductFormData } from '@/types/validations'
import { productFormSchema } from '@/validations/product-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import ProductForm from '@/components/forms/product-form'

export default function ProductView() {
  const { productId } = useParams()
  const router = useRouter()

  const { data: product } = useQuery<Product>({
    queryKey: ['productById', productId],
    queryFn: () => getProductById(productId as string),
  })

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: product?.name,
      brand: product?.brand,
      unit: product?.unit,
      stockQuantity: product?.stockQuantity,
      costPrice: product?.costPrice,
      profitMargin: product?.profitMargin,
      profit: product?.profit,
      salePrice: product?.salePrice,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    console.log(data)
  }

  const { reset } = productForm

  useEffect(() => {
    if (product) {
      reset({
        ...product,
      })
    }
  }, [product, reset])

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
