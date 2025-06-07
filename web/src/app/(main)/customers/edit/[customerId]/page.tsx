'use client'

import CustomerForm from '@/components/forms/customer-form'
import CancelDialog from '@/components/dialogs/cancel-dialog'

import { getCustomerById, updateCustomer } from '@/services/customer-service'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'
import { customerFormSchema } from '@/validations/customer-form-schema'
import { CustomerFormData } from '@/types/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types/customer'
import { Button } from '@/components/shadcnui/button'
import { toast } from '@/hooks/use-toast'
import { Page } from '@/components/layout/page'
import Breadcrumb from '@/components/ui/breadcrumb'
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr'

export default function EditCustomer() {
  const { customerId } = useParams()
  const router = useRouter()

  const { data: customer } = useQuery<Customer>({
    queryKey: ['customerById'],
    queryFn: () => getCustomerById(customerId as string),
  })

  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      city: customer?.address.city ?? '',
      neighborhood: customer?.address.neighborhood ?? '',
      street: customer?.address.street ?? '',
      number: customer?.address.number ?? '',
      complement: customer?.address.complement ?? '',
      reference: customer?.address.reference ?? '',
    },
  })

  const {
    reset,
    formState: { isDirty },
  } = customerForm

  const onSubmit = async (data: CustomerFormData) => {
    await updateCustomer(customerId as string, data)

    toast({
      title: 'Cliente editado com sucesso',
    })

    reset(data)
    router.back()
  }

  useEffect(() => {
    if (customer) {
      const { email, ...data } = customer

      reset({
        email: email ?? '',
        ...data,
      })
    }
  }, [customer, reset])

  return (
    <Page.Container>
      <Page.Header>
        <Breadcrumb
          currentPage="Editar cliente"
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
            <h2 className="font-medium">Editar cliente</h2>
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
              <span>Editar cliente</span>
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
