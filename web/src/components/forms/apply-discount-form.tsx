import InputError from '../ui/input-error'

import { formatCurrency } from '@/utils/format/format-currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'
import { discountFormSchema } from '@/validations/discount-form-schema'
import { DiscountFormData } from '@/types/validations'
import { percentageMask } from '@/utils/mask/percentage'
import { parseCurrency } from '@/utils/parse/currency'
import { formatPercentage } from '@/utils/format/format-percentage'

interface ApplyDiscountFormProps {
  subtotal: number
  onSubmit: (data: DiscountFormData) => void
  defaultValue?: number
}
export default function ApplyDiscountForm({
  subtotal,
  onSubmit,
  defaultValue,
}: ApplyDiscountFormProps) {
  const discountForm = useForm<DiscountFormData>({
    resolver: zodResolver(discountFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      amount: defaultValue ? (defaultValue / 100) * subtotal : 0,
      percentage: defaultValue ?? 0,
    },
  })

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = discountForm

  const amount = useWatch({ control, name: 'amount', defaultValue: 0 })

  const handleUpdatePercentage = (discount: number) => {
    const newAmount = Number(((discount / 100) * subtotal).toFixed(2))

    setValue('amount', newAmount, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const hadleUpdateAmount = (amount: number) => {
    const newPercentage =
      subtotal === 0 ? 0 : Number(((amount / subtotal) * 100).toFixed(2))

    setValue('percentage', newPercentage, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <form className="py-4" onSubmit={handleSubmit(onSubmit)} id="discount-form">
      <div className="flex justify-between text-sm">
        <h4>Subtotal</h4>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <h4>Total</h4>
        <span>{formatCurrency(subtotal - (amount ?? 0))}</span>
      </div>

      <div>
        <div className="mt-4 grid grid-cols-2 items-center gap-4">
          <Label htmlFor="percentage">Desconto em %:</Label>
          <div className="col-span-1">
            <Controller
              name="percentage"
              control={control}
              render={({ field }) => (
                <Input
                  id="value"
                  className="mt-1"
                  value={field.value ? formatPercentage(field.value) : '% 0,00'}
                  onChange={(e) => {
                    percentageMask(e)
                    const float = parseCurrency(e.target.value)
                    field.onChange(float)
                    handleUpdatePercentage(float)
                  }}
                />
              )}
            />
            <InputError error={errors.percentage?.message?.toString()} />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="amount">Desconto em R$:</Label>
          <div className="col-span-1">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <Input
                  id="value"
                  className="mt-1"
                  value={field.value ? formatCurrency(field.value) : 'R$ 0,00'}
                  onChange={(e) => {
                    const float = parseCurrency(e.target.value)
                    field.onChange(float)
                    hadleUpdateAmount(float)
                  }}
                />
              )}
            />
            <InputError error={errors.amount?.message?.toString()} />
          </div>
        </div>
      </div>
    </form>
  )
}
