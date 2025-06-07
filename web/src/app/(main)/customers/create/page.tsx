'use client'

import CancelDialog from '@/components/dialogs/cancel-dialog'
import CustomerForm from '@/components/forms/customer-form'
import Breadcrumb from '@/components/ui/breadcrumb'

import { FormProvider, useForm } from 'react-hook-form'
import { customerFormSchema } from '@/validations/customer-form-schema'
import { CustomerFormData } from '@/types/validations'
import { createCustomer } from '@/services/customer-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/shadcnui/button'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

export default function CreateCustomer() {
  const router = useRouter()

  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: '',
      reference: '',
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = customerForm

  const onSubmit = async (data: CustomerFormData) => {
    await createCustomer(data)

    toast({
      title: 'Cliente criado com sucesso',
    })

    reset()
    router.back()
  }

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Novo cliente"
          parents={[
            {
              name: 'Clientes',
              path: '/customers',
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
            <h2 className="font-medium">Novo cliente</h2>
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
              form="customer-form"
            >
              <span>Cadastrar cliente</span>
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <FormProvider {...customerForm}>
            <CustomerForm onSubmit={onSubmit} />
          </FormProvider>
        </div>
      </Page.Content>
    </Page.Container>
  )
}
