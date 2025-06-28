'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import Breadcrumb from '@/components/ui/breadcrumb'
import OrderForm from '@/components/forms/order-form'

import { getOrderById, updateOrder } from '@/services/order-service'
import { InstallmentOrderFormData } from '@/types/validations'
import { installmentOrderSchema } from '@/validations/installment-order-schema'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { getCustomers } from '@/services/customer-service'
import { getProducts } from '@/services/product-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { OrderType } from '@/enums/order-type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { Product } from '@/types/product'
import { Button } from '@/components/shadcnui/button'
import { Order } from '@/types/order'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import { AxiosError } from 'axios'
import { APIErrorResponse } from '@/types/api-error-response'

export default function EditOrder() {
  const { orderId } = useParams()
  const router = useRouter()

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { data: order } = useQuery<Order>({
    queryKey: ['orderById'],
    queryFn: () =>
      getOrderById(orderId as string, {
        includeProducts: true,
        includeCustomer: true,
      }),
    enabled: !!orderId,
  })

  const orderForm = useForm<InstallmentOrderFormData>({
    resolver: zodResolver(installmentOrderSchema),
    mode: 'onSubmit',
    defaultValues: {
      type: OrderType.INSTALLMENT,
      notes: order?.notes ?? '',
      customerId: order?.customer?.id ?? undefined,
      total: order?.total ?? 0,
      subtotal: order?.subtotal ?? 0,
      discount: order?.discount ?? 0,
      items: order?.items ?? [
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
    mutationFn: (data: InstallmentOrderFormData) =>
      updateOrder(orderId as string, data),
    onSuccess: async () => {
      toast({
        title: 'Pedido editado com sucesso',
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

  useEffect(() => {
    if (order) {
      reset({
        type: OrderType.INSTALLMENT,
        notes: order.notes ?? '',
        customerId: order.customer?.id ?? undefined,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        items: order.items ?? [
          {
            productId: undefined,
            unitPrice: 0,
            quantity: 1,
          },
        ],
      })
    }
  }, [order, customers, products, reset])

  if (!customers || !order || !products) return null

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Editar pedido"
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
            <h2 className="font-medium">Editar pedido</h2>
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
              <span>Editar</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 h-full">
          <FormProvider {...orderForm}>
            <OrderForm
              onSubmit={async (data) => mutate(data)}
              customers={customers}
              products={products}
            />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
