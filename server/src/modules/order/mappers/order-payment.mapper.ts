import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { PaymentMethod } from '@src/common/enums/payment-method.enum';
import { OrderPayment } from '@prisma/client';

export class OrderPaymentMapper {
  static toDto(orderPayment: OrderPayment): OrderPaymentDto {
    return {
      id: orderPayment.id,
      amount: Number(orderPayment.amount),
      installments: orderPayment.installments,
      paymentMethod: orderPayment.paymentMethod as PaymentMethod,
      paidAt: orderPayment.paidAt,
    };
  }
}
