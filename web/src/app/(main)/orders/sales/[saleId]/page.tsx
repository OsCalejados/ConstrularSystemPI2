'use client'

import SaleOrderForm from '@/components/forms/SaleOrderForm'
import Breadcrumb from '@/components/ui/breadcrumb'
import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { saleOrderSchema } from '@/validations/sale-order-schema'
import { SaleOrderFormData } from '@/types/validations'
import { getOrderById } from '@/services/order-service'
import { getCustomers } from '@/services/customer-service'
import { getProducts } from '@/services/product-service'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import LoadSpinner from '@/components/ui/load-spinner'
import { Customer } from '@/types/customer'
import { Product } from '@/types/product'

export default function ViewSale() {
  const [isLoading, setIsLoading] = useState(true)
  const { saleId } = useParams()
  const router = useRouter()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const saleForm = useForm<SaleOrderFormData>({
    resolver: zodResolver(saleOrderSchema),
    mode: 'onSubmit',
    defaultValues: async () => {
      const [order, customersData, productsData] = await Promise.all([
        getOrderById(saleId as string),
        getCustomers(),
        getProducts(),
      ])
      setCustomers(customersData)
      setProducts(productsData)
      setIsLoading(false)
      return {
        type: order.type,
        notes: order.notes,
        customerId: order.customerId,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        useBalance: order.useBalance,
        items: order.items.map(
          (item: {
            product: Product
            unitPrice: number
            quantity: number
            total: number
          }) => ({
            productId: item.product.id,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            total: item.total,
          }),
        ),
        paymentMethod: order.payments?.[0]?.method || undefined,
        amount: order.payments?.[0]?.amount || 0,
        change: order.payments?.[0]?.change || 0,
      }
    },
  })

  if (isLoading) return <LoadSpinner />

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Visualizar venda"
          parents={[
            {
              name: 'Pedidos',
              path: '/orders',
            },
            {
              name: 'Vendas',
              path: '/orders/sales',
            },
          ]}
        />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              className="w-8 h-8"
              variant="outline"
            >
              <CaretLeftIcon size={20} />
            </Button>
            <h2 className="font-medium">Visualizar venda</h2>
          </div>
        </div>
        <FormProvider {...saleForm}>
          <SaleOrderForm readOnly customers={customers} products={products} />
        </FormProvider>
      </Page.Content>
    </Page.Container>
  )
}
