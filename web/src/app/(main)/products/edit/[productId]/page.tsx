'use client'

import { useParams, useRouter } from 'next/navigation'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/shadcnui/button'
import ProductForm from '@/components/forms/product-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductFormData } from '@/types/validations'
import { updateProduct, getProductById } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import Breadcrumb from '@/components/ui/breadcrumb'
import { Page } from '@/components/layout/page'
import CancelDialog from '@/components/dialogs/cancel-dialog'
import { productFormSchema } from '@/validations/product-form-schema'

export default function EditProduct() {
  // const queryClient = useQueryClient()
  const router = useRouter()

  const { productId } = useParams()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
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

  const {
    reset,
    formState: { isDirty },
  } = productForm

  useEffect(() => {
    if (product) {
      reset({
        ...product,
      })
    }
  }, [product, reset])

  const onSubmit = async (data: ProductFormData) => {
    await updateProduct(productId as string, data)

    toast({
      title: 'Produto editado com sucesso',
    })

    reset()
    router.back()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

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
