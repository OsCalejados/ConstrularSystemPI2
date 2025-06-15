import { PaymentMethod } from '@src/common/enums/payment-method.enum';

export class OrderPaymentDto {
  id: number;
  amount: number;
  paymentMethod: PaymentMethod;
  installments: number;
  paidAt: Date;
}
