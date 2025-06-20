'use client'

import InputError from '../ui/input-error'

import { useForm } from 'react-hook-form'
import { NotesFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../shadcnui/button'
import { CheckIcon } from '@phosphor-icons/react/dist/ssr'

import { notesFormSchema } from '@/validations/notes-form-schema'
import { Textarea } from '../shadcnui/textarea'

interface UpdateNotesFormProps {
  notes: string
  onSubmit: (data: NotesFormData) => void
}

export default function UpdateNotesForm({
  notes,
  onSubmit,
}: UpdateNotesFormProps) {
  const notesForm = useForm<NotesFormData>({
    resolver: zodResolver(notesFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      notes,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = notesForm

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Insira notas sobre o pedido..."
            id="notes"
            {...register('notes')}
          />
          <Button
            type="submit"
            className="bg-primary gap-1 hover:bg-primary-hover px-0 min-w-10"
          >
            <CheckIcon className="h-4 w-4" weight="bold" />
          </Button>
        </div>
        <InputError error={errors.notes?.message?.toString()} />
      </div>
    </form>
  )
}
