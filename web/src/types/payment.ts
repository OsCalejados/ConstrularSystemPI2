import { PaymentMethod } from '@/enums/payment-method'

export interface Payment {
  id: number
  amount: number
  change: number
  netAmount: number
  paymentMethod: PaymentMethod
  installments: number
  paidAt: Date
}
