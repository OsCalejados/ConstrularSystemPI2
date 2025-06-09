'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/shadcnui/button'
import ProductForm from '@/components/forms/product-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductFormData, productSchema } from '@/types/validations'
import { updateProduct, getProductById } from '@/services/product-service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'

export default function EditProduct() {
  const { productId } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDirty, setIsDirty] = useState(false)

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      unit: 'UN',
      stockQuantity: 0,
      costPrice: 0,
      profitMargin: 0,
      salePrice: 0,
      profit: 0,
    },
  })

  // Buscar dados do produto
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId as string),
  })

  // Preencher o formulário quando os dados chegarem
  useEffect(() => {
    if (product) {
      methods.reset({
        name: product.name,
        brand: product.brand,
        unit: product.unit as
          | 'UN'
          | 'KG'
          | 'M'
          | 'M²'
          | 'M³'
          | 'SC'
          | 'GL'
          | 'L',
        stockQuantity: product.stockQuantity,
        costPrice: product.costPrice,
        profitMargin: product.profitMargin,
        salePrice: product.salePrice,
        profit: product.profit,
      })
    }
  }, [product, methods])

  // Monitorar mudanças no formulário
  useEffect(() => {
    const subscription = methods.watch(() => {
      setIsDirty(methods.formState.isDirty)
    })
    return () => subscription.unsubscribe()
  }, [methods])

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      updateProduct(productId as string, data),
    onSuccess: () => {
      toast({
        title: 'Produto atualizado com sucesso!',
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      router.push('/products')
    },
    onError: () => {
      toast({
        title: 'Erro ao atualizar produto',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = async (data: ProductFormData) => {
    await updateProductMutation.mutateAsync(data)
  }

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Você tem alterações não salvas. Tem certeza que deseja sair?',
      )
      if (!confirmed) return
    }
    router.push('/products')
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
    <div className="flex-1 space-y-4 p-4 md:p-8">
      {/* Header com breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <CaretLeftIcon size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/products" className="hover:text-foreground">
              Estoque
            </Link>
            <span>›</span>
            <Link href="/products" className="hover:text-foreground">
              Produtos
            </Link>
            <span>›</span>
            <span className="text-foreground">Editar produto</span>
          </div>
        </div>
      </div>

      {/* Título e ações */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Editar produto</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateProductMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={updateProductMutation.isPending}
          >
            {updateProductMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Formulário */}
      <FormProvider {...methods}>
        <ProductForm onSubmit={handleSubmit} />
      </FormProvider>
    </div>
  )
}
