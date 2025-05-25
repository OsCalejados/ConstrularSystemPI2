'use client'

import InputError from '../ui/input-error'

import { Controller, useForm } from 'react-hook-form'
import { statusFormSchema } from '@/lib/validations/status-form-schema'
import { StatusFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { OrderStatus } from '@/enums/order-status'
import { Button } from '../shadcnui/button'
import { Check } from '@phosphor-icons/react/dist/ssr'
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from '@/components/shadcnui/select'

interface UpdateStatusFormProps {
  status: OrderStatus
  onSubmit: (data: StatusFormData) => void
}

export default function UpdateStatusForm({
  status,
  onSubmit,
}: UpdateStatusFormProps) {
  const statusForm = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      status,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = statusForm

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex gap-2">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                name={field.name}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="submit"
            className="bg-button-primary gap-1 hover:bg-button-primary-hover px-0 min-w-10"
          >
            <Check className="h-4 w-4" weight="bold" />
          </Button>
        </div>
        <InputError error={errors.status?.message?.toString()} />
      </div>
    </form>
  )
}
