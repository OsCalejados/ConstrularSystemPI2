'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import Breadcrumb from '@/components/ui/breadcrumb'
import OrderForm from '@/components/forms/order-form'

import { InstallmentOrderFormData } from '@/types/validations'
import { installmentOrderSchema } from '@/validations/installment-order-schema'
import { FormProvider, useForm } from 'react-hook-form'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { getCustomers } from '@/services/customer-service'
import { getProducts } from '@/services/product-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { createOrder } from '@/services/order-service'
import { OrderType } from '@/enums/order-type'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import { AxiosError } from 'axios'
import { APIErrorResponse } from '@/types/api-error-response'

export default function CreateOrder() {
  const router = useRouter()

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const orderForm = useForm<InstallmentOrderFormData>({
    resolver: zodResolver(installmentOrderSchema),
    mode: 'onSubmit',
    defaultValues: {
      type: OrderType.INSTALLMENT,
      notes: '',
      customerId: undefined,
      total: 0,
      subtotal: 0,
      discount: 0,
      useBalance: false,
      items: [
        {
          productId: undefined,
          unitPrice: 0,
          quantity: 1,
        },
      ],
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = orderForm

  const { mutate } = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      toast({
        title: 'Pedido criado com sucesso',
      })

      reset()
      router.back()
    },
    onError: (e: AxiosError<APIErrorResponse>) => {
      toast({
        title: e.response?.data?.error?.message,
        variant: 'destructive',
      })
    },
  })

  if (!customers || !products) return null

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Novo pedido"
          parents={[
            {
              name: 'Pedidos',
              path: '/orders',
            },
            {
              name: 'Pedidos a prazo',
              path: '/orders/installments',
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
            <h2 className="font-medium">Novo pedido</h2>
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
              form="order-form"
            >
              <span>Cadastrar</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <FormProvider {...orderForm}>
            <OrderForm
              onSubmit={async (data) => mutate(data)}
              customers={customers}
              products={products}
              showBalanceOption
            />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
