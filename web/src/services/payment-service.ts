import { api } from '@/lib/axios'

export async function createPayment(orderId: string | number, value: number) {
  const response = await api.post('payments', { value, orderId })

  console.log(response.data)
}

export async function deletePayment(paymentId: number | string) {
  await api.delete(`payments/${paymentId}`)
}
