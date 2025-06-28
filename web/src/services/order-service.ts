import { InstallmentOrderFormData, PaymentFormData } from '@/types/validations'
import { OrderStatus } from '@/enums/order-status'
import api from '@/lib/axios'

interface FindOrderOptions {
  includePayments?: boolean
  includeProducts?: boolean
  includeCustomer?: boolean
  includeSeller?: boolean
  type?: string
}

export async function getOrders(options?: FindOrderOptions) {
  const response = await api.get('orders', {
    params: {
      includePayments: options?.includePayments,
      includeProducts: options?.includeProducts,
      includeCustomer: options?.includeCustomer,
      includeSeller: options?.includeSeller,
      type: options?.type,
    },
  })

  return response.data
}

export async function getOrderById(
  orderId: number | string,
  options?: FindOrderOptions,
) {
  const response = await api.get(`orders/${orderId}`, {
    params: {
      includePayments: options?.includePayments,
      includeProducts: options?.includeProducts,
      includeCustomer: options?.includeCustomer,
      includeSeller: options?.includeSeller,
    },
  })

  return response.data
}

export async function getOrdersByCustomer(
  customerId: number | string,
  options?: FindOrderOptions,
) {
  const response = await api.get(`orders/customer/${customerId}`, {
    params: {
      includePayments: options?.includePayments,
      includeProducts: options?.includeProducts,
      includeCustomer: options?.includeCustomer,
      includeSeller: options?.includeSeller,
    },
  })

  return response.data
}

export async function createOrder(orderFormData: InstallmentOrderFormData) {
  const response = await api.post('orders', orderFormData)

  console.log(response.data)
}

export async function updateOrder(
  orderId: number | string,
  orderFormData: InstallmentOrderFormData,
) {
  const response = await api.put(`orders/${orderId}`, orderFormData)

  console.log(response.data)
}

export async function updateNotes(orderId: number, notes: string) {
  const response = await api.put(`orders/${orderId}/notes`, { notes })

  console.log(response.data)
}

export async function updateStatus(orderId: number, status: OrderStatus) {
  const response = await api.put(`orders/${orderId}/status`, { status })

  console.log(response.data)
}

export async function deleteOrder(orderId: number | string) {
  await api.delete(`orders/${orderId}`)
}

export async function deleteManyOrders(orderIds: number[]) {
  await api.delete('orders', {
    data: {
      orderIds,
    },
  })
}

export async function addPayment(
  orderId: number | string,
  paymentFormData: PaymentFormData,
) {
  await api.post(`orders/${orderId}/payments`, paymentFormData)
}

export async function deletePayment(
  orderId: number | string,
  paymentId: number | string,
) {
  await api.delete(`orders/${orderId}/payments/${paymentId}`)
}
