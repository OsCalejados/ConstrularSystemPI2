import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';
import { OrderPayment } from '@prisma/client';

export class OrderPaymentMapper {
  static toDto(orderPayment: OrderPayment): OrderPaymentDto {
    return {
      id: orderPayment.id,
      amount: Number(orderPayment.amount),
      change: Number(orderPayment.change),
      netAmount: Number(orderPayment.amount) - Number(orderPayment.change),
      installments: orderPayment.installments,
      paymentMethod: orderPayment.paymentMethod as PaymentMethod,
      paidAt: orderPayment.paidAt,
    };
  }
}
