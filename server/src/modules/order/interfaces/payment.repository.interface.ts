import { OrderPaymentDto } from '../dtos/order-payment.dto';

export abstract class IPaymentRepository {
  abstract findById(paymentId: number): Promise<OrderPaymentDto>;
}
