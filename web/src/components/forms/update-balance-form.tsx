'use client'

import InputError from '../ui/input-error'

import { Controller, useForm } from 'react-hook-form'
import { balanceFormSchema } from '@/validations/balance-form-schema'
import { parseCurrency } from '@/utils/parse/currency'
import { BalanceFormData } from '@/types/validations'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@/utils/format/format-currency'
import { updateBalance } from '@/services/customer-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'

interface UpdateBalanceFormProps {
  balance: number
  customerId: number
}

export default function UpdateBalanceForm({
  balance,
  customerId,
}: UpdateBalanceFormProps) {
  const queryClient = useQueryClient()
  const balanceForm = useForm<BalanceFormData>({
    resolver: zodResolver(balanceFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      balance,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = balanceForm

  const onSubmit = async (data: BalanceFormData) => {
    await updateBalance(customerId, data)

    await queryClient.invalidateQueries({
      queryKey: ['customerById'],
    })
  }

  return (
    <form className="py-4" onSubmit={handleSubmit(onSubmit)} id="balance-form">
      <Label htmlFor="balance" className="text-right">
        Saldo
      </Label>
      <Controller
        name="balance"
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
      <InputError error={errors.balance?.message?.toString()} />
    </form>
  )
}
