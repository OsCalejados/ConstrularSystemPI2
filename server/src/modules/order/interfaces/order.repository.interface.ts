import { FindOrderOptions } from './find-order-options.interface';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdateStatusDto } from '../dtos/update-status';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { OrderDto } from '../dtos/order.dto';

export abstract class IOrderRepository {
  abstract findAll(options?: FindOrderOptions): Promise<OrderDto[]>;

  abstract findById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto>;

  abstract findByCustomer(
    customerId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]>;

  abstract findByProductId(
    productId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto[]>;

  abstract create(order: OrderDto, sellerId: number): Promise<OrderDto>;

  abstract update(orderId: number, order: OrderDto): Promise<OrderDto>;

  abstract updateNotes(
    orderId: number,
    updateStatusDto: UpdateNotesDto,
  ): Promise<OrderDto>;

  abstract updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
  ): Promise<OrderDto>;

  abstract updateIsPaid(orderId: number, isPaid: boolean): Promise<void>;

  abstract deleteById(orderId: number): Promise<OrderDto>;

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  abstract findPayments(orderId: number): Promise<OrderPaymentDto[]>;

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  abstract addPayment(
    orderId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<OrderDto>;

  abstract deletePayment(paymentId: number): Promise<void>;
}
