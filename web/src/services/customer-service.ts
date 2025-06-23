import { BalanceFormData, CustomerFormData } from '@/types/validations'
import api from '@/lib/axios'

interface FindCustomerOptions {
  includeAddress?: boolean
  includeOrders?: boolean
}

export async function getCustomers() {
  const response = await api.get('customers')

  return response.data
}

export async function getCustomerById(
  customerId: number | string,
  options?: FindCustomerOptions,
) {
  const response = await api.get(`customers/${customerId}`, {
    params: { includeAddress: options?.includeAddress },
  })

  return response.data
}

export async function createCustomer(customerFormData: CustomerFormData) {
  console.log(customerFormData)

  const { email, ...data } = customerFormData

  const response = await api.post('customers', {
    email: email !== '' ? email : undefined,
    ...data,
  })

  console.log(response.data)
}

export async function updateCustomer(
  customerId: number | string,
  customerFormData: CustomerFormData,
) {
  const { email, ...data } = customerFormData

  const response = await api.put(`customers/${customerId}`, {
    email: email !== '' ? email : undefined,
    ...data,
  })

  console.log(response.data)
}

export async function updateBalance(
  customerId: number,
  balanceFormData: BalanceFormData,
) {
  const response = await api.put(
    `customers/${customerId}/balance`,
    balanceFormData,
  )

  console.log(response.data)
}

export async function deleteCustomer(customerId: number | string) {
  await api.delete(`customers/${customerId}`)
}

export async function deleteManyCustomers(customerIds: number[]) {
  await api.delete('customers', {
    data: {
      customerIds,
    },
  })
}
