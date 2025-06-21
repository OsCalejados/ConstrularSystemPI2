import InputError from '../ui/input-error'

import { Controller, useForm } from 'react-hook-form'
import { paymentFormSchema } from '@/validations/payment-form-schema'
import { PaymentFormData } from '@/types/validations'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@/utils/format/format-currency'
import { parseCurrency } from '@/utils/parse/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcnui/select'
import { PaymentMethod } from '@/enums/payment-method.'
import { useEffect } from 'react'
import { addPayment } from '@/services/order-service'

interface AddPaymentFormProps {
  orderId: number
  remainingAmount: number
}

export default function AddPaymentForm({
  orderId,
  remainingAmount,
}: AddPaymentFormProps) {
  const queryClient = useQueryClient()
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      orderId,
      amount: 0,
      change: 0,
      installments: 1,
      paymentMethod: undefined,
    },
  })

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = paymentForm

  const paymentMethod = watch('paymentMethod')
  const amount = watch('amount')

  useEffect(() => {
    if (paymentMethod === PaymentMethod.CASH) {
      const change = Math.max((amount ?? 0) - remainingAmount, 0)
      setValue('change', change)
    } else {
      setValue('change', 0)
    }
  }, [amount, paymentMethod, remainingAmount, setValue])

  const onSubmit = async (data: PaymentFormData) => {
    await addPayment(orderId, data)

    queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })
  }

  return (
    <form
      className="py-4 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      id="payment-form"
    >
      <div>
        <Label htmlFor="paymentMethod">Forma de pagamento *</Label>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value)
                if (value !== PaymentMethod.CASH) {
                  setValue('amount', remainingAmount)
                }
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentMethod.CREDIT}>
                  Cartão de crédito
                </SelectItem>
                <SelectItem value={PaymentMethod.DEBIT}>
                  Cartão de débito
                </SelectItem>
                <SelectItem value={PaymentMethod.CASH}>Dinheiro</SelectItem>
                <SelectItem value={PaymentMethod.PIX}>Pix</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <InputError error={errors.paymentMethod?.message?.toString()} />
      </div>

      <div>
        <Label htmlFor="amount" className="text-right">
          Valor do pagamento
        </Label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="mt-1"
              value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
              onChange={(e) => {
                const float = parseCurrency(e.target.value)
                field.onChange(float)
              }}
            />
          )}
        />
        <InputError error={errors.amount?.message?.toString()} />
      </div>

      {paymentMethod === PaymentMethod.CASH && (
        <div>
          <Label htmlFor="change" className="text-right">
            Troco
          </Label>
          <Controller
            name="change"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="mt-1"
                value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
                onChange={(e) => {
                  const float = parseCurrency(e.target.value)
                  field.onChange(float)
                }}
              />
            )}
          />
          <InputError error={errors.change?.message?.toString()} />
        </div>
      )}

      {paymentMethod === PaymentMethod.CREDIT && (
        <div>
          <Label htmlFor="installments">Parcelas *</Label>
          <Controller
            name="installments"
            control={control}
            render={({ field }) => (
              <Select
                name={field.name}
                value={field.value?.toString()}
                onValueChange={(value) => {
                  field.onChange(Number(value))
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a qantidade de parcelas" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 4 }, (_, i) => i + 1).map(
                    (installment) => (
                      <SelectItem
                        key={installment}
                        value={installment.toString()}
                      >
                        {installment}x de {formatCurrency(amount / installment)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />

          <InputError
            error={errors.installments?.message?.toString()}
            className="text-wrap"
          />
        </div>
      )}
    </form>
  )
}
