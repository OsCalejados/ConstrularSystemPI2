import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { OrderPaymentDto } from '../dtos/order-payment.dto';

export abstract class IPaymentRepository {
  abstract findById(paymentId: number): Promise<OrderPaymentDto>;

  abstract findByOrder(orderId: number): Promise<OrderPaymentDto[]>;

  abstract create(payment: CreatePaymentDto): Promise<OrderPaymentDto>;

  abstract deleteById(paymentId: number): Promise<OrderPaymentDto>;
}
