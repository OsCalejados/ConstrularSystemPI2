import InputError from '../ui/input-error'

import { paymentFormSchema } from '@/validations/payment-form-schema'
import { PaymentFormData } from '@/types/validations'
import { parseCurrency } from '@/utils/parse/currency'
import { formatCurrency } from '@/utils/format/format-currency'
import { currencyMask } from '@/utils/mask/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'
import { createPayment } from '@/services/payment-service'
import { useQueryClient } from '@tanstack/react-query'

interface AddPaymentFormProps {
  orderId: number
}
export default function AddPaymentForm({ orderId }: AddPaymentFormProps) {
  const queryClient = useQueryClient()
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      value: formatCurrency(0),
    },
  })

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = paymentForm

  const onSubmit = async (data: PaymentFormData) => {
    const { value } = data

    const formattedValue = parseCurrency(value)

    await createPayment(orderId, formattedValue)

    queryClient.invalidateQueries({
      queryKey: ['orderById'],
    })
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const currentValue = event.currentTarget.value
      const formattedValue = formatCurrency(parseCurrency(currentValue))
      setValue('value', formattedValue)
    }
  }

  return (
    <form className="py-4" onSubmit={handleSubmit(onSubmit)} id="balance-form">
      <Label htmlFor="balance" className="text-right">
        Valor do pagamento
      </Label>
      <Input
        id="value"
        type="text"
        className="col-span-3 mt-1"
        {...register('value', {
          onChange: currencyMask,
        })}
        onKeyDown={handleEnterKey}
      />
      <InputError error={errors.value?.message?.toString()} />
    </form>
  )
}
