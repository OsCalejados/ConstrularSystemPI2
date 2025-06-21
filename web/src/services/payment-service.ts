import { api } from '@/lib/axios'
import { PaymentFormData } from '@/types/validations'

export async function createPayment(paymentFormData: PaymentFormData) {
  await api.post('payments', paymentFormData)
}

export async function deletePayment(paymentId: number | string) {
  await api.delete(`payments/${paymentId}`)
}
