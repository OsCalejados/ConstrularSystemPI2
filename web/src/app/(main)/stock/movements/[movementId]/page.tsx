'use client'

import MovementForm from '@/components/forms/movement-form'
import Breadcrumb from '@/components/ui/breadcrumb'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { movementFormSchema } from '@/validations/movement-form-schema'
import { MovementFormData } from '@/types/validations'
import { getMovementById } from '@/services/movement-service'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/shadcnui/button'
import { Page } from '@/components/layout/page'
import LoadSpinner from '@/components/ui/load-spinner'

export default function ViewMovement() {
  const [isLoading, setIsLoading] = useState(true)
  const { movementId } = useParams()
  const router = useRouter()

  const movementForm = useForm<MovementFormData>({
    resolver: zodResolver(movementFormSchema),
    mode: 'onSubmit',
    defaultValues: async () => {
      const data = await getMovementById(movementId as string)
      setIsLoading(false)
      return {
        description: data.description,
        type: data.type,
        items: data.items,
      }
    },
  })

  if (isLoading) return <LoadSpinner />

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Visualizar movimentação"
          parents={[
            {
              name: 'Estoque',
              path: '/stock/movements',
            },
          ]}
        />
      </Page.Header>
      <Page.Content>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              className="w-8 h-8"
              variant="outline"
            >
              <CaretLeftIcon size={20} />
            </Button>
            <h2 className="font-medium">Visualizar movimentação</h2>
          </div>
        </div>
        <FormProvider {...movementForm}>
          <MovementForm onSubmit={async () => {}} readOnly />
        </FormProvider>
      </Page.Content>
    </Page.Container>
  )
}
