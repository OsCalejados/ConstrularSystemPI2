import { OrderFormData } from '@/types/validations'
import { api } from '@/lib/axios'
import { OrderStatus } from '@/enums/order-status'

export async function getOrders() {
  const response = await api.get('orders')

  return response.data
}

export async function getOrderById(orderId: number | string) {
  const response = await api.get(`orders/${orderId}`)

  return response.data
}

export async function getOrdersByCustomer(
  customerId: number | string,
  page: number = 1,
  pageSize: number = 12,
  status?: string,
) {
  const response = await api.get(`orders/customer/${customerId}`, {
    params: { page, pageSize, status },
  })

  return response.data
}

export async function createOrder(orderFormData: OrderFormData) {
  const { customerId: id, ...data } = orderFormData
  const customerId = parseInt(id)

  const body = {
    customerId,
    ...data,
  }

  const response = await api.post('orders', body)

  console.log(response.data)
}

export async function updateOrder(
  orderId: number | string,
  orderFormData: OrderFormData,
) {
  const { customerId: id, ...data } = orderFormData
  const customerId = parseInt(id)

  const body = {
    customerId,
    ...data,
  }

  const response = await api.put(`orders/${orderId}`, body)

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
