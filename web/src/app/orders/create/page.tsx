'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import InputError from '@/components/ui/input-error'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { orderFormSchema } from '@/lib/validations/order-form-schema'
import { OrderFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@/enums/order-status'
import { useRouter, useSearchParams } from 'next/navigation'
import { Textarea } from '@/components/shadcnui/textarea'
import { Button } from '@/components/shadcnui/button'
import { Trash } from '@phosphor-icons/react/dist/ssr'
import { Input } from '@/components/shadcnui/input'
import { Label } from '@/components/shadcnui/label'
import { Page } from '@/components/layout/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcnui/select'
import { createOrder } from '@/services/order-service'
import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { getCustomers } from '@/services/customer-service'
import { toast } from '@/hooks/use-toast'
import { Suspense } from 'react'

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CreateOrder />
    </Suspense>
  )
}

function CreateOrder() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const customerId = searchParams.get('customer')

  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const orderForm = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      customerId: customerId ?? '',
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
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty },
  } = orderForm

  const { fields, append, remove } = useFieldArray({
    rules: {
      minLength: 1,
    },
    name: 'items',
    control,
  })

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Novo pedido</h1>
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
              className="bg-button-primary hover:bg-button-primary-hover"
              type="submit"
              form="order-form"
            >
              <span>Cadastrar pedido</span>
            </Button>
          </div>
        </div>
      </Page.Header>

      <div className="mt-4">
        <form
          className="flex flex-col lg:flex-row gap-4"
          id="order-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Items */}
          <div className="border-primary h-fit flex flex-col gap-4 flex-[3] border p-6 pt-4 rounded-xl text-primary">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Produtos</h2>
              <button
                type="button"
                onClick={() => {
                  append({
                    name: '',
                    quantity: NaN,
                    unit: 'UN',
                  })
                  clearErrors()
                }}
                className="text-button-primary hover:text-button-primary-hover text-sm"
              >
                Adicionar novo item personalizado
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`name.${index}`}>Nome *</Label>
                    <Input
                      placeholder="Insira o nome"
                      id={`name.${index}`}
                      {...register(`items.${index}.name`)}
                      className="mt-1"
                    />
                    {errors.items?.[index]?.name?.message ? (
                      <InputError
                        error={errors.items?.[index]?.name?.message?.toString()}
                      />
                    ) : (
                      <InputError error="placeholder" className="opacity-0" />
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`unit.${index}`}>Unidade *</Label>
                    <Controller
                      name={`items.${index}.unit`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          name={field.name}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UN">UN</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="KG">KG</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.items?.[index]?.unit?.message ? (
                      <InputError
                        error={errors.items?.[index]?.unit?.message?.toString()}
                      />
                    ) : (
                      <InputError error="placeholder" className="opacity-0" />
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`quantity.${index}`}>Quantidade *</Label>

                    <Input
                      type="number"
                      placeholder="Insira a quantidade"
                      id={`quantity.${index}`}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="mt-1"
                    />

                    {errors.items?.[index]?.quantity?.message ? (
                      <InputError
                        error={errors.items?.[
                          index
                        ]?.quantity?.message?.toString()}
                        className="text-wrap"
                      />
                    ) : (
                      <InputError error="placeholder" className="opacity-0" />
                    )}
                  </div>

                  {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0"
                      onClick={() => remove(index)}
                    >
                      <Trash size={24} className="text-terciary" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="border-primary flex h-fit flex-col gap-4 flex-[2] border px-6 py-4 rounded-xl text-primary">
            <h2 className="font-medium">Detalhes do Pedido</h2>
            <div className="mt-2 flex flex-col gap-4">
              <div>
                <Label htmlFor="customerId">Cliente *</Label>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      disabled={!!customerId}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <InputError error={errors.customerId?.message?.toString()} />
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  placeholder="Insira notas sobre o pedido..."
                  id="notes"
                  {...register('notes')}
                  className="mt-1"
                />
                <InputError error={errors.notes?.message?.toString()} />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <InputError error={errors.status?.message?.toString()} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Page.Container>
  )
}
