import InputError from '../ui/input-error'

import { customers } from '@/data/customers'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '../shadcnui/button'
import { Textarea } from '../shadcnui/textarea'
import { Input } from '@/components/shadcnui/input'
import { Label } from '@/components/shadcnui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcnui/select'
import { OrderFormData } from '@/types/validations'
import { TrashIcon } from '@phosphor-icons/react/dist/ssr'

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<void>
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const {
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useFormContext<OrderFormData>()

  const { fields, append, remove } = useFieldArray({
    rules: {
      minLength: 1,
    },
    name: 'items',
    control,
  })

  return (
    <form
      className="flex flex-col lg:flex-row gap-4"
      id="order-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Items */}
      <div className="border-primary h-fit flex flex-col gap-4 flex-[3] border p-6 pt-4 rounded-xl text-primary">
        {/* Title */}
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Produtos</h4>
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
            className="text-contrast hover:text-contrast-hover text-sm"
          >
            Adicionar novo item
          </button>
        </div>

        {/* Fields */}
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
                    error={errors.items?.[index]?.quantity?.message?.toString()}
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
                  <TrashIcon size={24} className="text-terciary" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="border-primary flex h-fit flex-col gap-4 flex-[2] border px-6 py-4 rounded-xl text-primary">
        {/* Title */}
        <h4 className="font-medium">Detalhes do pedido</h4>

        {/* Fields */}
        <div className="mt-2 flex flex-col gap-4">
          <div>
            <Label htmlFor="customerId">Cliente *</Label>
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Select
                  name={field.name}
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
  )
}
