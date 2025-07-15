import { PaymentMethod } from '@src/common/enums/payment-method.enum';

export class UpdateOrderPaymentDto {
  amount: number;
  change: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  installments: number;
  paidAt: Date;
}
