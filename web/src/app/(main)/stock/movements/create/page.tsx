'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import MovementForm from '@/components/forms/movement-form'
import Breadcrumb from '@/components/ui/breadcrumb'

import { FormProvider, useForm } from 'react-hook-form'
import { movementFormSchema } from '@/validations/movement-form-schema'
import { MovementFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shadcnui/button'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

export default function CreateMovement() {
  const router = useRouter()

  const movementForm = useForm<MovementFormData>({
    resolver: zodResolver(movementFormSchema),
    mode: 'onTouched',
    defaultValues: {
      description: '',
      type: 'Entrada',
      products: [{ name: '', unit: 'UN', quantity: 1 }],
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = movementForm

  const onSubmit = async (data: MovementFormData) => {
    // Aqui você pode chamar o serviço de criação de movimentação futuramente
    toast({
      title: 'Movimentação cadastrada com sucesso',
    })
    reset()
    router.back()
  }

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Nova movimentação"
          parents={[
            {
              name: 'Estoque',
              path: '/stock/movements',
            },
          ]}
        />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isDirty ? (
              <CancelDialog>
                <Button className="w-8 h-8" variant="outline">
                  <CaretLeftIcon size={20} />
                </Button>
              </CancelDialog>
            ) : (
              <Button
                onClick={() => router.back()}
                className="w-8 h-8"
                variant="outline"
              >
                <CaretLeftIcon size={20} />
              </Button>
            )}
            <h2 className="font-medium">Nova movimentação</h2>
          </div>
          <div className="flex gap-2">
            {isDirty ? (
              <CancelDialog>
                <Button variant="ghost">
                  <span>Cancelar</span>
                </Button>
              </CancelDialog>
            ) : (
              <Button variant="ghost" onClick={router.back}>
                <span>Cancelar</span>
              </Button>
            )}
            <Button
              className="bg-primary hover:bg-primary-hover"
              type="submit"
              form="movement-form"
            >
              <span>Cadastrar</span>
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <FormProvider {...movementForm}>
            <MovementForm onSubmit={onSubmit} />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
