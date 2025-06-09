'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import ProductForm from '@/components/forms/product-form'
import Breadcrumb from '@/components/ui/breadcrumb'

import { FormProvider, useForm } from 'react-hook-form'
import { productFormSchema } from '@/validations/product-form-schema'
import { ProductFormData } from '@/types/validations'
import { createProduct } from '@/services/product-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shadcnui/button'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

export default function CreateProduct() {
  const router = useRouter()

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      brand: '',
      unit: 'UN',
      stockQuantity: 0,
      costPrice: 0,
      profitMargin: 0,
      profit: 0,
      salePrice: 0,
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = productForm

  const onSubmit = async (data: ProductFormData) => {
    await createProduct(data)

    toast({
      title: 'Produto criado com sucesso',
    })

    reset()
    router.back()
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
            <h2 className="font-medium">Novo produto</h2>
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
              <span>Cadastrar</span>
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
