'use client'

import Breadcrumb from '@/components/ui/breadcrumb'
import { useParams, useRouter } from 'next/navigation'
import { getOrderById } from '@/services/order-service'
import {
  CaretLeftIcon,
  ClockClockwiseIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import LoadSpinner from '@/components/ui/load-spinner'
import { useQuery } from '@tanstack/react-query'
import { Order } from '@/types/order'
import { Label } from '@/components/shadcnui/label'
import { Input } from '@/components/shadcnui/input'
import { formatCurrency } from '@/utils/format/format-currency'
import { formatPercentage } from '@/utils/format/format-percentage'
import { User } from 'lucide-react'
import { OrderStatus } from '@/enums/order-status'
import { PaymentMethod } from '@/enums/payment-method'

export default function ViewSale() {
  const { saleId } = useParams()
  const router = useRouter()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['orderById'],
    queryFn: () =>
      getOrderById(saleId as string, {
        includeCustomer: true,
        includePayments: true,
        includeItems: true,
      }),
  })

  if (!order) return null

  const customer = order.customer

  const address = [
    customer?.address.neighborhood,
    customer?.address.city,
    customer?.address.street,
    customer?.address.number,
    customer?.address.complement,
    customer?.address.reference,
  ].filter(Boolean)

  const payment = order.payments?.at(0)

  const formatPaymentMethod = (paymentMethod: PaymentMethod) => {
    switch (paymentMethod) {
      case PaymentMethod.CASH:
        return 'Dinheiro'
      case PaymentMethod.CREDIT:
        return 'Cartão de crédito'
      case PaymentMethod.DEBIT:
        return 'Cartão de débito'
      case PaymentMethod.PIX:
        return 'Pix'
      default:
        return 'Tipo de pagamento não identificado'
    }
  }

  if (isLoading || !payment) return <LoadSpinner />

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage={`Pedido #${saleId.toString().padStart(6, '0')}`}
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
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              className="w-8 h-8"
              variant="outline"
            >
              <CaretLeftIcon size={20} />
            </Button>
            <h2 className="font-medium">
              Pedido #{saleId.toString().padStart(6, '0')}
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Esquerda */}
          <div className="flex flex-col gap-4 flex-[4]">
            {/* Items */}
            <div className="border-primary max-h-[calc(100vh-412px)] flex flex-col gap-4 border p-5 pt-4 rounded-xl text-primary">
              {/* Title */}
              <div className="pt-1 px-1 flex justify-between items-center">
                <h4 className="font-medium">Produtos</h4>
              </div>

              {/* Fields */}
              <div className="px-1 mt-2 pb-1 flex flex-1 flex-col gap-4 overflow-y-auto">
                {order.items?.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`name.${index}`}>Nome</Label>
                      <Input
                        disabled
                        placeholder="Insira o nome"
                        id={`name.${index}`}
                        value={item.product?.name}
                        className="mt-1 disabled:opacity-100 disabled:cursor-text"
                      />
                    </div>

                    <div className="w-32">
                      <Label htmlFor={`unitPrice.${index}`}>
                        Preço unitário
                      </Label>
                      <Input
                        disabled
                        id={`quantity.${index}`}
                        value={formatCurrency(item.unitPrice)}
                        className="mt-1 disabled:opacity-100 disabled:cursor-text"
                      />
                    </div>

                    <div className="w-32">
                      <Label htmlFor={`quantity.${index}`}>Quantidade</Label>
                      <Input
                        disabled
                        type="number"
                        value={item.quantity}
                        id={`quantity.${index}`}
                        className="mt-1 disabled:opacity-100 disabled:cursor-text"
                      />
                    </div>

                    <div className="w-36">
                      <Label htmlFor={`unitPrice.${index}`}>Total</Label>
                      <Input
                        disabled
                        id={`total.${index}`}
                        value={formatCurrency(item.total)}
                        className="mt-1 disabled:opacity-100 disabled:cursor-text"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-primary flex flex-col gap-4 border p-6 pt-4 rounded-xl text-primary">
              <h4 className="font-medium">Conta</h4>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-terciary">Quantidade de itens</span>
                  <span className="font-medium">
                    {order.items?.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0,
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <h4 className="text-terciary">Subtotal</h4>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-terciary">Desconto</span>
                  <div className="flex items-center gap-2">
                    <span className="text-currency font-medium">
                      {' '}
                      -{' '}
                      {formatCurrency(
                        (order.discount / 100) * order.subtotal,
                      )}{' '}
                      ({formatPercentage(order.discount, 'suffix')})
                    </span>
                  </div>
                </div>

                <div className="border-t-1 border-dashed border my-2 border-gray-300" />

                <div className="flex justify-between font-medium">
                  <h4>Total</h4>
                  <span className="text-currency">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direita */}
          <div className="flex flex-col gap-4 flex-[2] text-primary">
            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h4 className="font-medium">Notas</h4>

              <p className="text-terciary text-sm">
                {!order.notes || order.notes === ''
                  ? 'Nenhuma nota especificada.'
                  : order.notes}
              </p>
            </div>

            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h4 className="font-medium">Cliente</h4>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2 text-sm items-center">
                  <User size={16} />
                  <span className="text-terciary">{order.customer?.name}</span>
                </li>
                <li>
                  <div className="flex gap-2 text-sm items-center">
                    <MapPinIcon size={16} className="min-w-4 min-h-4" />
                    <span className="text-terciary">
                      {address.length === 0 &&
                      !order.customer?.address.neighborhood
                        ? 'Endereço não informado'
                        : address.length > 0
                          ? address.join(', ')
                          : order.customer?.address.neighborhood}
                    </span>
                  </div>
                  {order.customer?.address.neighborhood &&
                    address.length > 0 && (
                      <div className="flex gap-2 text-sm items-center">
                        <div className="min-w-4 min-h-4" />
                        <span className="text-terciary">
                          {order.customer?.address.neighborhood}
                        </span>
                      </div>
                    )}
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <PhoneIcon size={16} />
                  <span className="text-terciary">
                    {!order.customer?.phone || order.customer?.phone === ''
                      ? 'Telefone não informado.'
                      : order.customer.phone}
                  </span>
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <EnvelopeSimpleIcon size={16} />
                  <span className="text-terciary">
                    {!order.customer?.email || order.customer?.email === ''
                      ? 'E-mail não informado.'
                      : order.customer.email}
                  </span>
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <WalletIcon size={16} />
                  <span className="text-terciary">
                    {formatCurrency(order.customer?.balance ?? 0)}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h4 className="font-medium">Status</h4>
              <div className="flex gap-2 text-sm items-center">
                <ClockClockwiseIcon size={16} />
                <span>
                  {order.status === OrderStatus.OPEN
                    ? 'Em aberto'
                    : order.status === OrderStatus.COMPLETED
                      ? 'Concluído'
                      : 'Cancelado'}
                </span>
              </div>
            </div>

            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h4 className="font-medium">Pagamento</h4>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <h4 className="text-terciary">Forma de pagamento</h4>
                  <span className="font-medium">
                    {formatPaymentMethod(payment?.paymentMethod)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <h4 className="text-terciary">Valor pago</h4>
                  <span className="font-medium">
                    {formatCurrency(payment?.amount ?? 0)}
                  </span>
                </div>
                {payment?.paymentMethod === PaymentMethod.CASH && (
                  <div className="flex justify-between text-sm">
                    <h4 className="text-terciary">Troco</h4>
                    <span className="font-medium">
                      {formatCurrency(payment?.change)}
                    </span>
                  </div>
                )}

                {payment?.paymentMethod === PaymentMethod.CREDIT && (
                  <div className="flex justify-between text-sm">
                    <h4 className="text-terciary">Parcelas</h4>
                    <span className="font-medium">{payment?.installments}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
