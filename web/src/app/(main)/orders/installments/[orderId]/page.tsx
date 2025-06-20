'use client'

import AddPaymentDialog from '@/components/dialogs/add-payment-dialog'
import UpdateStatusForm from '@/components/forms/update-status-form'
import UpdateNotesForm from '@/components/forms/update-notes-form'
import OrderOptions from '@/components/dropdown-menus/order-options'

import { NotesFormData, StatusFormData } from '@/types/validations'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Order as TOder } from '@/types/order'
import { formatCurrency } from '@/utils/format/format-currency'
import { deletePayment } from '@/services/payment-service'
import { OrderStatus } from '@/enums/order-status'
import { formatDate } from '@/utils/format/format-date'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Payment } from '@/types/payment'
import { Button } from '@/components/shadcnui/button'
import { Input } from '@/components/shadcnui/input'
import { Label } from '@/components/shadcnui/label'
import { Page } from '@/components/layout/page'
import { TrashIcon, User } from 'lucide-react'
import {
  EnvelopeSimple,
  ClockClockwise,
  PencilSimple,
  MapPin,
  Wallet,
  Trash,
  Phone,
  CaretLeftIcon,
  PencilSimpleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeSimpleIcon,
  WalletIcon,
  ClockClockwiseIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  getOrderById,
  updateStatus,
  updateNotes,
} from '@/services/order-service'
import Breadcrumb from '@/components/ui/breadcrumb'
import CustomerOptions from '@/components/dropdown-menus/customer-options'
import { Customer } from '@/types/customer'
import router from 'next/router'
import ApplyDiscountDialog from '@/components/dialogs/apply-discount'
import InputError from '@/components/ui/input-error'
import { products } from '@/data/products'
import { formatPercentage } from '@/utils/format/format-percentage'
import { parseCurrency } from '@/utils/parse/currency'
import { parseNumber } from '@/utils/parse/number'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select'
import { Controller } from 'react-hook-form'

export default function Order() {
  // const [editStatus, setEditStatus] = useState(false)
  const [editNotes, setEditNotes] = useState(false)
  const queryClient = useQueryClient()

  const { orderId } = useParams()

  const { data: order } = useQuery<TOder>({
    queryKey: ['orderById'],
    queryFn: () =>
      getOrderById(orderId as string, {
        includeCustomer: true,
        includeProducts: true,
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

  // const onPaymentDelete = async (payment: Payment) => {
  //   await deletePayment(payment.id)

  //   await queryClient.invalidateQueries({
  //     queryKey: ['orderById'],
  //   })
  // }

  // const onStatusUpdate = async (data: StatusFormData) => {
  //   const { status } = data

  //   await updateStatus(order.id, status as OrderStatus)

  //   await queryClient.invalidateQueries({
  //     queryKey: ['orderById'],
  //   })

  //   setEditStatus(false)
  // }

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
            <CustomerOptions
              customer={
                {
                  id: 1,
                  address: {
                    id: 1,
                  },
                  balance: 0,
                  name: 'Teste',
                  email: 'af',
                  orders: [],
                } as Customer
              }
              variant="primary"
              showBalanceItem
              useLongLabel
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-full">
          <div className="flex flex-col gap-4 flex-[4] h-full">
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
            <div className="border-primary h-fit flex flex-col gap-4 border p-6 pt-4 rounded-xl text-primary">
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

          <div className="flex flex-col gap-4 flex-[2] px-6 py-4 text-primary">
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

              <div className="flex justify-between">
                <span>Valor restante</span>
                <span className="text-currency font-medium">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="border-t-1 border-dashed border my-2 border-gray-300" />
            </div>
          </div>
        </div>
      </Page.Content>

      {/* <div className="mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div>esquerda</div>
          <div className="flex flex-col gap-4 flex-[2]">
            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Notas</h2>
                {!editNotes && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-terciary"
                    onClick={() => setEditNotes(true)}
                  >
                    <PencilSimple size={16} />
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
              <h2 className="font-medium">Cliente</h2>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2 text-sm items-center">
                  <User size={16} />
                  <span className="text-terciary">{customer.name}</span>
                </li>
                <li>
                  <div className="flex gap-2 text-sm items-center">
                    <MapPin size={16} className="min-w-4 min-h-4" />
                    <span className="text-terciary">
                      {address.length === 0 && !customer.address.landmark
                        ? 'Endereço não informado'
                        : address.length > 0
                          ? address.join(', ')
                          : customer.address.landmark}
                    </span>
                  </div>
                  {customer.address.landmark && address.length > 0 && (
                    <div className="flex gap-2 text-sm items-center">
                      <div className="min-w-4 min-h-4" />
                      <span className="text-terciary">
                        {customer.address.landmark}
                      </span>
                    </div>
                  )}
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <Phone size={16} />
                  <span className="text-terciary">
                    {!customer.phone || customer.phone === ''
                      ? 'Telefone não informado.'
                      : customer.phone}
                  </span>
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <EnvelopeSimple size={16} />
                  <span className="text-terciary">
                    {!customer.email || customer.email === ''
                      ? 'E-mail não informado.'
                      : customer.email}
                  </span>
                </li>
                <li className="flex gap-2 text-sm items-center">
                  <Wallet size={16} />
                  <span className="text-terciary">
                    {formatCurrency(customer.balance)}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Status</h2>
                {!editStatus && (
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-terciary"
                    onClick={() => setEditStatus(true)}
                  >
                    <PencilSimple size={16} />
                  </Button>
                )}
              </div>

              {!editStatus ? (
                <div className="flex gap-2 text-sm items-center">
                  <ClockClockwise size={16} />
                  <span>
                    {order.status === OrderStatus.PENDING ? 'Pendente' : 'Pago'}
                  </span>
                </div>
              ) : (
                <UpdateStatusForm
                  status={order.status}
                  onSubmit={onStatusUpdate}
                />
              )}
            </div>

            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h2 className="font-medium">Controle de pagamento</h2>

              <div>
                {!order.payments || order.payments.length === 0 ? (
                  <p className="text-terciary text-sm">
                    Nenhum registro de pagamento encontrado.
                  </p>
                ) : (
                  order.payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex gap-2 text-sm items-center text-terciary"
                    >
                      <span className="flex-1">Pagamento {index + 1}</span>
                      <span>{formatCurrency(payment.value)}</span>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onPaymentDelete(payment)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end items-center">
                <AddPaymentDialog orderId={order.id}>
                  <button className="text-button-primary hover:text-button-primary-hover text-sm text-right px-[10px]">
                    Adicionar pagamento
                  </button>
                </AddPaymentDialog>
              </div>

              {order.payments && order.payments.length > 0 && (
                <>
                  <div className="h-px bg-border my-4" />

                  <div className="items-center justify-center flex">
                    <span className="text-currency font-medium text-2xl">
                      {formatCurrency(
                        order.payments?.reduce(
                          (total, payment) => total + payment.value,
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </Page.Container>
  )
}
