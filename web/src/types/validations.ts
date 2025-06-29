import { installmentOrderSchema } from '@/validations/installment-order-schema'
import { customerFormSchema } from '@/validations/customer-form-schema'
import { productFormSchema } from '@/validations/product-form-schema'
import { balanceFormSchema } from '@/validations/balance-form-schema'
import { paymentFormSchema } from '@/validations/payment-form-schema'
import { statusFormSchema } from '@/validations/status-form-schema'
import { notesFormSchema } from '@/validations/notes-form-schema'
import { loginFormSchema } from '@/validations/login-form-schema'
import { movementFormSchema } from '@/validations/movement-form-schema'
import { saleOrderSchema } from '@/validations/sale-order-schema'
import { z } from 'zod'

export type InstallmentOrderFormData = z.infer<typeof installmentOrderSchema>

export type CustomerFormData = z.infer<typeof customerFormSchema>

export type BalanceFormData = z.infer<typeof balanceFormSchema>

export type PaymentFormData = z.infer<typeof paymentFormSchema>

export type StatusFormData = z.infer<typeof statusFormSchema>

export type NotesFormData = z.infer<typeof notesFormSchema>

export type LoginFormData = z.infer<typeof loginFormSchema>

export type ProductFormData = z.infer<typeof productFormSchema>

export type MovementFormData = z.infer<typeof movementFormSchema>

export type SaleOrderFormData = z.infer<typeof saleOrderSchema>
