import { customerFormSchema } from '@/validations/customer-form-schema'
import { balanceFormSchema } from '@/validations/balance-form-schema'
import { paymentFormSchema } from '@/validations/payment-form-schema'
import { statusFormSchema } from '@/validations/status-form-schema'
import { orderFormSchema } from '@/validations/order-form-schema'
import { z } from 'zod'
import { notesFormSchema } from '@/validations/notes-form-schema'
import { loginFormSchema } from '@/validations/login-form-schema'

export type OrderFormData = z.infer<typeof orderFormSchema>

export type CustomerFormData = z.infer<typeof customerFormSchema>

export type BalanceFormData = z.infer<typeof balanceFormSchema>

export type PaymentFormData = z.infer<typeof paymentFormSchema>

export type StatusFormData = z.infer<typeof statusFormSchema>

export type NotesFormData = z.infer<typeof notesFormSchema>

export type LoginFormData = z.infer<typeof loginFormSchema>