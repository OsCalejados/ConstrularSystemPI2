'use client'

import InputError from '../ui/input-error'

import { balanceFormSchema } from '@/lib/validations/balance-form-schema'
import { currencyToFloat } from '@/utils/currencyToFloat'
import { BalanceFormData } from '@/types/validations'
import { formatCurrency } from '@/utils/formatCurrency'
import { currencyMask } from '@/utils/currencyMask'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Label } from '../shadcnui/label'
import { Input } from '../shadcnui/input'
import { updateBalance } from '@/services/customer-service'
import { useQueryClient } from '@tanstack/react-query'

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
      balance: formatCurrency(balance),
    },
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = balanceForm

  const onSubmit = async (data: BalanceFormData) => {
    const { balance } = data

    const formattedBalance = currencyToFloat(balance)

    await updateBalance(customerId, formattedBalance)

    await queryClient.invalidateQueries({
      queryKey: ['customerById'],
    })
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const currentValue = event.currentTarget.value
      const formattedValue = formatCurrency(currencyToFloat(currentValue))
      setValue('balance', formattedValue)
    }
  }

  return (
    <form className="py-4" onSubmit={handleSubmit(onSubmit)} id="balance-form">
      <Label htmlFor="balance" className="text-right">
        Saldo
      </Label>
      <Input
        id="balance"
        type="text"
        className="col-span-3"
        {...register('balance', {
          onChange: currencyMask,
        })}
        onKeyDown={handleEnterKey}
      />
      <InputError error={errors.balance?.message?.toString()} />
    </form>
  )
}
