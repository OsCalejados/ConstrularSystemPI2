'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getMovementById } from '@/services/movement-service'
import { MovementFormData } from '@/types/validations'
import { movementFormSchema } from '@/validations/movement-form-schema'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Page } from '@/components/layout/page'
import Breadcrumb from '@/components/ui/breadcrumb'
import MovementForm from '@/components/forms/movement-form'
import { Button } from '@/components/shadcnui/button'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { MeasureUnit } from '@/enums/measure-unit'

export default function ViewMovement() {
  const { movementId } = useParams()
  const router = useRouter()

  const { data: movement, isLoading } = useQuery<MovementFormData | undefined>({
    queryKey: ['movement', movementId],
    queryFn: async () => {
      const m = await getMovementById(movementId as string)
      return {
        ...m,
        products: m.products.map((p) => ({
          ...p,
          unit: p.unit as MeasureUnit,
        })),
        type: m.status, // garante compatibilidade
      }
    },
    enabled: !!movementId,
  })

  const movementForm = useForm<MovementFormData>({
    resolver: zodResolver(movementFormSchema),
    mode: 'onTouched',
    values: movement,
  })

  if (isLoading || !movement) return null

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
