import InputError from '../ui/input-error'

import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
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
import { InstallmentOrderFormData } from '@/types/validations'
import { TrashIcon } from '@phosphor-icons/react/dist/ssr'
import { getProducts } from '@/services/product-service'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/types/product'
import { Customer } from '@/types/customer'
import { getCustomers } from '@/services/customer-service'
import { formatCurrency } from '@/utils/format-currency'
import { currencyToFloat } from '@/utils/currency-to-float'

interface OrderFormProps {
  onSubmit: (data: InstallmentOrderFormData) => Promise<void>
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useFormContext<InstallmentOrderFormData>()

  const { fields, append, remove } = useFieldArray({
    rules: {
      minLength: 1,
    },
    name: 'items',
    control,
  })

  const watchedItems = useWatch({ name: 'items' })

  const handleUpdateTotal = (
    index: number,
    unitPrice: number,
    quantity: number,
  ) => {
    const total = unitPrice * quantity
    setValue(`items.${index}.total`, total)
  }

  if (!customers || !products) return null

  return (
    <form
      className="flex flex-col lg:flex-row gap-4"
      id="order-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Items */}
      <div className="border-primary h-fit flex flex-col gap-4 flex-[4] border p-6 pt-4 rounded-xl text-primary">
        {/* Title */}
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Produtos</h4>
          <button
            type="button"
            onClick={() => {
              append({
                productId: '' as unknown as number,
                unitPrice: 0,
                quantity: 1,
                total: 0,
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
            <div key={field.id} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor={`productId.${index}`}>Produto *</Label>
                <Controller
                  name={`items.${index}.productId`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      value={field.value?.toString()}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                        const product = products.find(
                          (p) => p.id.toString() === value,
                        )
                        if (product) {
                          setValue(
                            `items.${index}.unitPrice`,
                            Number(product.salePrice),
                          )

                          const quantity = watchedItems?.[index]?.quantity || 0

                          handleUpdateTotal(index, product.salePrice, quantity)
                        }
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <InputError
                  error={errors.items?.[index]?.productId?.message?.toString()}
                />
              </div>

              <div className="w-32">
                <Label htmlFor={`unitPrice.${index}`}>Preço unitário *</Label>
                <Controller
                  name={`items.${index}.unitPrice`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mt-1"
                      value={
                        field.value ? formatCurrency(field.value) : 'R$ 0,00'
                      }
                      onChange={(e) => {
                        const float = currencyToFloat(e.target.value)

                        field.onChange(float)

                        const quantity = watchedItems?.[index]?.quantity || 0
                        handleUpdateTotal(index, float, quantity)
                      }}
                    />
                  )}
                />

                <InputError
                  error={errors.items?.[index]?.unitPrice?.message?.toString()}
                  className="text-wrap"
                />
              </div>

              <div className="w-32">
                <Label htmlFor={`quantity.${index}`}>Quantidade *</Label>
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mt-1"
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value)
                        field.onChange(newQuantity)
                        const unitPrice = watchedItems?.[index]?.unitPrice || 0
                        handleUpdateTotal(index, unitPrice, newQuantity)
                      }}
                    />
                  )}
                />

                <InputError
                  error={errors.items?.[index]?.quantity?.message?.toString()}
                  className="text-wrap"
                />
              </div>

              <div className="w-36">
                <Label htmlFor={`total.${index}`}>Total</Label>
                <Controller
                  name={`items.${index}.total`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mt-1 bg-gray-100"
                      readOnly
                      value={
                        field.value ? formatCurrency(field.value) : 'R$ 0,00'
                      }
                    />
                  )}
                />
                {/* <InputError
                  error={errors.items?.[index]?.total?.message?.toString()}
                  className="text-wrap"
                /> */}
              </div>

              {fields.length > 1 && (
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 mt-7"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon size={24} className="text-terciary" />
                  </Button>
                </div>
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
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
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
                    <SelectItem value="OPEN">Aberto</SelectItem>
                    <SelectItem value="COMPLETED">Completo</SelectItem>
                    <SelectItem value="CANCELED">Cancelado</SelectItem>
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
