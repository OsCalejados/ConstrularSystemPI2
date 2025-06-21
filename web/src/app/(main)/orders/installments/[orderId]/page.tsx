'use client'

import AddPaymentDialog from '@/components/dialogs/add-payment-dialog'
import UpdateNotesForm from '@/components/forms/update-notes-form'
import Breadcrumb from '@/components/ui/breadcrumb'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Order as TOrder } from '@/types/order'
import { formatCurrency } from '@/utils/format/format-currency'
import { NotesFormData } from '@/types/validations'
import { OrderStatus } from '@/enums/order-status'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/shadcnui/button'
import { Input } from '@/components/shadcnui/input'
import { Label } from '@/components/shadcnui/label'
import {
  deletePayment,
  getOrderById,
  updateNotes,
} from '@/services/order-service'
import { formatPercentage } from '@/utils/format/format-percentage'
import { Payment } from '@/types/payment'
import { Page } from '@/components/layout/page'
import { TrashIcon, User } from 'lucide-react'
import {
  CaretLeftIcon,
  PencilSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  WalletIcon,
  ClockClockwiseIcon,
} from '@phosphor-icons/react/dist/ssr'
import OrderOptions from '@/components/dropdown-menus/order-options'

export default function Order() {
  const [editNotes, setEditNotes] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { orderId } = useParams()

  const { data: order } = useQuery<TOrder>({
    queryKey: ['orderById'],
    queryFn: () =>
      getOrderById(orderId as string, {
        includeCustomer: true,
        includeProducts: true,
        includePayments: true,
      }),
  })

  if (!order) return null

  const remainingAmount =
    order.total -
    (order.payments?.reduce(
      (sum, payment) => sum + (payment.netAmount ?? 0),
      0,
    ) ?? 0)

  const customer = order.customer

  const address = [
    customer?.address.neighborhood,
    customer?.address.city,
    customer?.address.street,
    customer?.address.number,
    customer?.address.complement,
    customer?.address.reference,
  ].filter(Boolean)

  const onPaymentDelete = async (payment: Payment) => {
    await deletePayment(order.id, payment.id)

    await queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })
  }

  const onNotesUpdate = async (data: NotesFormData) => {
    const { notes } = data

    await updateNotes(order.id, notes)

    await queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })
    setEditNotes(false)
  }

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage={`Pedido ${order.id}`}
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
            <Button
              onClick={() => router.back()}
              className="w-8 h-8"
              variant="outline"
            >
              <CaretLeftIcon size={20} />
            </Button>
            <h2 className="font-medium">Pedido {order.id}</h2>
          </div>
          <div className="flex gap-2">
            <OrderOptions order={order} variant="primary" />
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
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notas</h4>
                {!editNotes && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-terciary"
                    onClick={() => setEditNotes(true)}
                  >
                    <PencilSimpleIcon size={16} />
                  </Button>
                )}
              </div>

              {!editNotes ? (
                <p className="text-terciary text-sm">
                  {!order.notes || order.notes === ''
                    ? 'Nenhuma nota especificada.'
                    : order.notes}
                </p>
              ) : (
                <UpdateNotesForm
                  notes={order.notes ?? ''}
                  onSubmit={onNotesUpdate}
                />
              )}
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
              <h4 className="font-medium">Controle de pagamentos</h4>

              <div className="flex justify-end items-center">
                {remainingAmount > 0 && (
                  <AddPaymentDialog
                    orderId={order.id}
                    remainingAmount={remainingAmount}
                  >
                    <button className="text-contrast hover:text-contrast-hover text-sm text-right">
                      Adicionar pagamento
                    </button>
                  </AddPaymentDialog>
                )}
              </div>

              <div>
                {!order.payments || order.payments.length === 0 ? (
                  <p className="text-terciary text-sm text-center">
                    Nenhum registro de pagamento encontrado.
                  </p>
                ) : (
                  order.payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex gap-2 text-sm items-center text-terciary"
                    >
                      <span className="flex-1">Pagamento {index + 1}</span>
                      <span>{formatCurrency(payment.netAmount)}</span>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onPaymentDelete(payment)}
                      >
                        <TrashIcon size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="h-px bg-border my-4" />

              <div className="items-center justify-center flex flex-col gap-2">
                <span className="text-currency font-medium text-2xl">
                  {formatCurrency(remainingAmount)}
                </span>
                <span className="text-sm text-terciary">Valor restante</span>
              </div>
            </div>
          </div>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
