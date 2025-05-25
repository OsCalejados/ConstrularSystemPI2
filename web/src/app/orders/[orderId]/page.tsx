'use client'

import AddPaymentDialog from '@/components/dialogs/add-payment-dialog'
import UpdateStatusForm from '@/components/forms/update-status-form'
import UpdateNotesForm from '@/components/forms/update-notes-form'
import OrderOptions from '@/components/dropdown-menus/order-options'

import { NotesFormData, StatusFormData } from '@/types/validations'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Order as TOder } from '@/types/order'
import { formatCurrency } from '@/utils/formatCurrency'
import { deletePayment } from '@/services/payment-service'
import { OrderStatus } from '@/enums/order-status'
import { formatDate } from '@/utils/formatDate'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Payment } from '@/types/payment'
import { Button } from '@/components/shadcnui/button'
import { Input } from '@/components/shadcnui/input'
import { Label } from '@/components/shadcnui/label'
import { Page } from '@/components/layout/page'
import { User } from 'lucide-react'
import {
  EnvelopeSimple,
  ClockClockwise,
  PencilSimple,
  MapPin,
  Wallet,
  Trash,
  Phone,
} from '@phosphor-icons/react/dist/ssr'
import {
  getOrderById,
  updateStatus,
  updateNotes,
} from '@/services/order-service'

export default function Order() {
  useEffect(() => {
    console.log('window.electron:', window.electron)
  }, [])

  const [editStatus, setEditStatus] = useState(false)
  const [editNotes, setEditNotes] = useState(false)
  const queryClient = useQueryClient()

  const { orderId } = useParams()

  const { data: order } = useQuery<TOder>({
    queryKey: ['orderById'],
    queryFn: () => getOrderById(orderId as string),
  })

  if (!order) return null

  const customer = order.customer

  const address = [
    customer.address.district,
    customer.address.street,
    customer.address.number,
    customer.address.complement,
  ].filter(Boolean)

  const onPaymentDelete = async (payment: Payment) => {
    await deletePayment(payment.id)

    await queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })
  }

  const onStatusUpdate = async (data: StatusFormData) => {
    const { status } = data

    await updateStatus(order.id, status as OrderStatus)

    await queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })

    setEditStatus(false)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Pedido {order.id}</h1>
            <span className="text-terciary">{formatDate(order.createdAt)}</span>
          </div>

          <OrderOptions order={order} variant="primary" showPrintItem />
        </div>
      </Page.Header>

      <div className="mt-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Items */}
          <div className="border-primary h-fit flex flex-col gap-4 flex-[3] border p-6 pt-4 rounded-xl text-primary">
            <h2 className="font-medium">Produtos</h2>

            <div className="mt-2 flex flex-col gap-2">
              {order.items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`name.${index}`}>Nome</Label>
                    <Input
                      disabled
                      placeholder="Insira o nome"
                      id={`name.${index}`}
                      value={item.name}
                      className="mt-1 disabled:opacity-100 disabled:cursor-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`quantity.${index}`}>Quantidade</Label>
                    <Input
                      disabled
                      type="number"
                      placeholder="Insira a quantidade"
                      id={`quantity.${index}`}
                      value={item.quantity}
                      className="mt-1 disabled:opacity-100 disabled:cursor-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`unit.${index}`}>Unidade</Label>
                    <div className="mt-1 flex h-10 w-16 items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
                      {item.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="flex flex-col gap-4 flex-[2]">
            {/* Notes */}
            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              {/* Header */}
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

              {/* Body */}
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

            {/* Customer */}
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

            {/* Order Status */}
            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              {/* Header */}
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

              {/* Body */}
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

            {/* Payments */}
            <div className="border-primary flex h-fit flex-col gap-4 border px-6 pt-4 pb-6 rounded-xl text-primary">
              <h2 className="font-medium">Controle de pagamento</h2>

              {/* Payments */}
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

              {/* Add payment */}
              <div className="flex justify-end items-center">
                <AddPaymentDialog orderId={order.id}>
                  <button className="text-button-primary hover:text-button-primary-hover text-sm text-right px-[10px]">
                    Adicionar pagamento
                  </button>
                </AddPaymentDialog>
              </div>

              {/* Total payment */}
              {order.payments && order.payments.length > 0 && (
                <>
                  {/* Divider */}
                  <div className="h-px bg-border my-4" />

                  {/* Total payment */}
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
      </div>
    </Page.Container>
  )
}
