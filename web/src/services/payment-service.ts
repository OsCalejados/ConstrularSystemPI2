import { PaymentFormData } from '@/types/validations'
import { api } from '@/lib/axios'

export async function createPayment(
  orderId: number | string,
  paymentFormData: PaymentFormData,
) {
  await api.patch(`orders/${orderId}/payment`, paymentFormData)
}

export async function deletePayment(paymentId: number | string) {
  await api.delete(`payments/${paymentId}`)
}
