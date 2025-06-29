import ApplyDiscountDialog from '../dialogs/apply-discount'
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
import { SaleOrderFormData } from '@/types/validations'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr'
import { Product } from '@/types/product'
import { Customer } from '@/types/customer'
import { formatCurrency } from '@/utils/format/format-currency'
import { parseCurrency } from '@/utils/parse/currency'
import { useCallback, useEffect, useMemo } from 'react'
import { parseNumber } from '@/utils/parse/number'
import { formatPercentage } from '@/utils/format/format-percentage'

interface SaleOrderFormProps {
  onSubmit?: (data: SaleOrderFormData) => Promise<void>
  customers: Customer[]
  products: Product[]
  showBalanceOption?: boolean
  readOnly?: boolean
}

export default function SaleOrderForm({
  onSubmit,
  customers,
  products,
  showBalanceOption = false,
  readOnly = false,
}: SaleOrderFormProps) {
  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useFormContext<SaleOrderFormData>()

  const { fields, append, remove } = useFieldArray({
    rules: {
      minLength: 1,
    },
    name: 'items',
    control,
  })

  const watchedItems = useWatch({ control, name: 'items', defaultValue: [] })

  const { watch } = useFormContext<SaleOrderFormData>()

  const quantityTotal = useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  }, [watchedItems])

  const subtotal = useWatch({ control, name: 'subtotal' }) || 0
  const discount = useWatch({ control, name: 'discount' }) || 0
  const total = useWatch({ control, name: 'total' }) || 0

  const updateOrderTotals = useCallback(() => {
    const subtotal = watchedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0,
    )
    const total = subtotal - subtotal * (discount / 100)
    setValue('subtotal', subtotal)
    setValue('total', total)
  }, [watchedItems, discount, setValue])

  const updateItemTotal = (
    index: number,
    unitPrice: number,
    quantity: number,
  ) => {
    const total = unitPrice * quantity
    setValue(`items.${index}.total`, total)
  }

  useEffect(() => {
    updateOrderTotals()
  }, [watchedItems, updateOrderTotals])

  const updateDiscount = (discount: number) => {
    setValue('discount', discount)
  }

  return (
    <form
      className="flex flex-col lg:flex-row gap-4"
      id="order-form"
      onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
    >
      <div className="flex flex-col gap-4 flex-[4]">
        {/* Produtos */}
        <div className="border-primary max-h-[calc(100vh-412px)] flex flex-col gap-4 border p-5 pt-4 rounded-xl text-primary">
          <div className="pt-1 px-1 flex justify-between items-center">
            <h4 className="font-medium">Produtos</h4>
            {!readOnly && (
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
            )}
          </div>
          <div className="px-1 mt-2 pb-1 flex flex-1 flex-col gap-4 overflow-y-auto">
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
                        onValueChange={
                          readOnly
                            ? undefined
                            : (value) => {
                                field.onChange(Number(value))
                                const product = products.find(
                                  (p) => p.id.toString() === value,
                                )
                                if (product) {
                                  setValue(
                                    `items.${index}.unitPrice`,
                                    Number(product.salePrice),
                                    {
                                      shouldValidate: true,
                                    },
                                  )
                                  const quantity =
                                    watchedItems?.[index]?.quantity || 0
                                  updateItemTotal(
                                    index,
                                    product.salePrice,
                                    quantity,
                                  )
                                }
                              }
                        }
                        disabled={readOnly}
                      >
                        <SelectTrigger className="mt-1" disabled={readOnly}>
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
                    error={errors.items?.[
                      index
                    ]?.productId?.message?.toString()}
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
                        onChange={
                          readOnly
                            ? undefined
                            : (e) => {
                                const float = parseCurrency(e.target.value)
                                field.onChange(float)
                                const quantity =
                                  watchedItems?.[index]?.quantity || 0
                                updateItemTotal(index, float, quantity)
                              }
                        }
                        disabled={readOnly}
                      />
                    )}
                  />
                  <InputError
                    error={errors.items?.[
                      index
                    ]?.unitPrice?.message?.toString()}
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
                        value={field.value ?? ''}
                        onChange={
                          readOnly
                            ? undefined
                            : (e) => {
                                const parsed = parseNumber(e.target.value)
                                field.onChange(parsed)
                                updateItemTotal(
                                  index,
                                  watchedItems?.[index]?.unitPrice || 0,
                                  parsed,
                                )
                              }
                        }
                        disabled={readOnly}
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
                        disabled={readOnly}
                      />
                    )}
                  />
                </div>
                {!readOnly && fields.length > 1 && (
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
        {/* Conta */}
        <div className="border-primary flex flex-col gap-4 border p-6 pt-4 rounded-xl text-primary">
          <h4 className="font-medium">Conta</h4>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-terciary">Quantidade de itens</span>
              <span className="font-medium">{quantityTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <h4 className="text-terciary">Subtotal</h4>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-terciary">Desconto</span>
              <div className="flex items-center gap-2">
                <span className="text-currency font-medium">
                  {' '}
                  - {formatCurrency((discount / 100) * subtotal)} (
                  {formatPercentage(discount, 'suffix')})
                </span>
                {!readOnly && (
                  <ApplyDiscountDialog
                    subtotal={subtotal}
                    discount={discount}
                    onConfirm={updateDiscount}
                  >
                    <Button className="w-6 h-6 bg-primary p-0 hover:bg-primary-hover">
                      <PencilSimpleIcon size={16} />
                    </Button>
                  </ApplyDiscountDialog>
                )}
              </div>
            </div>
            <div className="border-t-1 border-dashed border my-2 border-gray-300" />
            <div className="flex justify-between font-medium">
              <h4>Total</h4>
              <span className="text-currency">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Coluna Direita */}
      <div className="flex flex-col gap-4 flex-[2]">
        <div className="border-primary flex flex-col gap-4 border px-6 py-4 rounded-xl text-primary">
          <h4 className="font-medium">Detalhes do pedido</h4>
          <div className="mt-2 flex flex-col gap-4">
            <div>
              <Label htmlFor="customerId">Cliente *</Label>
              <Controller
                name="customerId"
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value ? field.value.toString() : ''}
                    onValueChange={
                      readOnly
                        ? undefined
                        : (value) => {
                            if (Number(value)) field.onChange(Number(value))
                          }
                    }
                    disabled={readOnly}
                  >
                    <SelectTrigger className="mt-1" disabled={readOnly}>
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
                readOnly={readOnly}
                disabled={readOnly}
              />
              <InputError error={errors.notes?.message?.toString()} />
            </div>
          </div>
          {showBalanceOption && (
            <div className="flex items-center gap-3">
              <input
                id="useBalance"
                type="checkbox"
                {...register('useBalance')}
                disabled={readOnly}
              />
              <label
                htmlFor="useBalance"
                className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Utilizar saldo disponível no pagamento deste pedido
              </label>
            </div>
          )}
        </div>
        {/* Pagamentos */}
        <div className="border-primary flex flex-col gap-4 border px-4 py-4 rounded-xl text-primary">
          <h4 className="font-medium">Pagamentos</h4>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="paymentMethod">Forma de pagamento *</Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={
                      readOnly ? undefined : (value) => field.onChange(value)
                    }
                    disabled={readOnly}
                  >
                    <SelectTrigger className="mt-1" disabled={readOnly}>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT">Cartão de crédito</SelectItem>
                      <SelectItem value="DEBIT">Cartão de débito</SelectItem>
                      <SelectItem value="PIX">Pix</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <InputError error={errors.paymentMethod?.message?.toString()} />
            </div>
            <div>
              <Label htmlFor="amount">Valor do pagamento</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="mt-1"
                    value={
                      field.value ? formatCurrency(field.value) : 'R$ 0,00'
                    }
                    onChange={
                      readOnly
                        ? undefined
                        : (e) => {
                            const float = parseCurrency(e.target.value)
                            field.onChange(float)
                          }
                    }
                    disabled={readOnly}
                  />
                )}
              />
              <InputError error={errors.amount?.message?.toString()} />
            </div>
            {watch('paymentMethod') === 'CASH' && (
              <div>
                <Label htmlFor="change">Troco</Label>
                <Controller
                  name="change"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="mt-1"
                      value={
                        field.value ? formatCurrency(field.value) : 'R$ 0,00'
                      }
                      onChange={
                        readOnly
                          ? undefined
                          : (e) => {
                              const float = parseCurrency(e.target.value)
                              field.onChange(float)
                            }
                      }
                      disabled={readOnly}
                    />
                  )}
                />
                <InputError error={errors.change?.message?.toString()} />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
