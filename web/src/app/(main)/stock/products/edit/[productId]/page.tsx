'use client'

import { useParams, useRouter } from 'next/navigation'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/shadcnui/button'
import ProductForm from '@/components/forms/product-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductFormData } from '@/types/validations'
import { updateProduct, getProductById } from '@/services/product-service'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'
import Breadcrumb from '@/components/ui/breadcrumb'
import { Page } from '@/components/layout/page'
import CancelDialog from '@/components/dialogs/cancel-dialog'
import { productFormSchema } from '@/validations/product-form-schema'
import { Product } from '@/types/product'
import LoadSpinner from '@/components/ui/load-spinner'

export default function EditProduct() {
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const router = useRouter()
  const { productId } = useParams()

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

  const {
    reset,
    formState: { isDirty },
  } = productForm

  const onSubmit = async (data: ProductFormData) => {
    await updateProduct(productId as string, data)

    toast({
      title: 'Produto editado com sucesso',
    })

    reset()
    router.back()
  }

  if (isLoading || !product) return <LoadSpinner />

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Produto não encontrado</div>
      </div>
    )
  }

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Novo produto"
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
            {isDirty ? (
              <CancelDialog>
                <Button className="w-8 h-8" variant="outline">
                  <CaretLeftIcon size={20} />
                </Button>
              </CancelDialog>
            ) : (
              <Button
                onClick={() => router.back()}
                className="w-8 h-8"
                variant="outline"
              >
                <CaretLeftIcon size={20} />
              </Button>
            )}
            <h2 className="font-medium">Editar produto</h2>
          </div>
          <div className="flex gap-2">
            {isDirty ? (
              <CancelDialog>
                <Button variant="ghost">
                  <span>Cancelar</span>
                </Button>
              </CancelDialog>
            ) : (
              <Button variant="ghost" onClick={router.back}>
                <span>Cancelar</span>
              </Button>
            )}

            <Button
              className="bg-primary hover:bg-primary-hover"
              type="submit"
              form="product-form"
            >
              <span>Editar</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <FormProvider {...productForm}>
            <ProductForm onSubmit={onSubmit} />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
