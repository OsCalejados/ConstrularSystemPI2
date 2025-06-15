'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'

import { FormProvider, useForm } from 'react-hook-form'
import { orderFormSchema } from '@/validations/order-form-schema'
import { OrderFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@/enums/order-status'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import { createOrder } from '@/services/order-service'
import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { getCustomers } from '@/services/customer-service'
import { toast } from '@/hooks/use-toast'
import OrderForm from '@/components/forms/order-form'
import Breadcrumb from '@/components/ui/breadcrumb'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
// import { Suspense } from 'react'

// export default function CreateOrderPage() {
//   return (
//     <Suspense fallback={<div>Carregando...</div>}>
//       <CreateOrder />
//     </Suspense>
//   )
// }

export default function CreateOrder() {
  const router = useRouter()

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const orderForm = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      customerId: '',
      notes: '',
      status: OrderStatus.PENDING,
      items: [
        {
          name: '',
          quantity: 1,
          unit: 'UN',
        },
      ],
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = orderForm

  const onSubmit = async (data: OrderFormData) => {
    await createOrder(data)

    toast({
      title: 'Pedido criado com sucesso',
    })

    reset()
    router.back()
  }

  if (!customers) return null

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
              form="customer-form"
            >
              <span>Cadastrar pedido</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <FormProvider {...orderForm}>
            <OrderForm onSubmit={onSubmit} />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
