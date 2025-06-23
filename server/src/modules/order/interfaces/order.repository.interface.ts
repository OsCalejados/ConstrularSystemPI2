import { FindOrderOptions } from './find-order-options.interface';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdateStatusDto } from '../dtos/update-status';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { UpdateNotesDto } from '../dtos/update-notes';
import { OrderDto } from '../dtos/order.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/common/services/prisma.service';
import { CreateOrderDto } from '../dtos/create-order.dto';

export abstract class IOrderRepository {
  constructor(protected prisma: PrismaService) {}
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

  abstract create(
    order: CreateOrderDto,
    sellerId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<OrderDto>;

  abstract update(
    orderId: number,
    order: OrderDto,
    tx?: Prisma.TransactionClient,
  ): Promise<OrderDto>;

  abstract updateNotes(
    orderId: number,
    updateStatusDto: UpdateNotesDto,
  ): Promise<OrderDto>;

  abstract updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
    tx?: Prisma.TransactionClient,
  ): Promise<OrderDto>;

  abstract updateIsPaid(
    orderId: number,
    isPaid: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  abstract deleteById(orderId: number): Promise<void>;

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
