import { FindOrderOptions } from '../interfaces/find-order-options.interface';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import { UpdateStatusDto } from '../dtos/update-status';
import { UpdateNotesDto } from '../dtos/update-notes';
import { PrismaService } from '@src/common/services/prisma.service';
import { OrderMapper } from '../mappers/order.mapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDto } from '../dtos/order.dto';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { OrderPaymentMapper } from '../mappers/order-payment.mapper';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Injectable()
export class PrismaOrderRepository extends IOrderRepository {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async findAll(options?: FindOrderOptions): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        ...(options?.type && { type: options.type }),
      },
      include: {
        payments: options?.includePayments ?? false,
        customer: options?.includeCustomer ?? false,
        seller: options?.includeSeller ?? false,
        items: options?.includeItems ?? false,
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async findById(
    orderId: number,
    options?: FindOrderOptions,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      include: {
        payments: options?.includePayments ?? false,
        customer: {
          include: {
            address: options?.includeCustomer ?? false,
          },
        },
        seller: options?.includeSeller ?? false,
        items: {
          include: {
            product: options?.includeItems ?? false,
          },
        },
      },
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return OrderMapper.toDto(order);
  }

  async findByCustomer(customerId: number): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        customerId,
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async findByProductId(productId: number): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            productId,
          },
        },
      },
    });

    return orders.map((order) => OrderMapper.toDto(order));
  }

  async create(
    order: CreateOrderDto,
    sellerId: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<OrderDto> {
    const createdOrder = await tx.order.create({
      data: {
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        type: order.type,
        discount: order.discount,
        paid: order.paid,
        notes: order.notes,
        seller: {
          connect: {
            id: sellerId ?? undefined,
          },
        },
        ...(order.customerId && {
          customer: {
            connect: {
              id: order.customerId ?? undefined,
            },
          },
        }),
        items: {
          createMany: {
            data: order.items,
          },
        },
        payments: order.payments
          ? {
              create: order.payments.map((payment) => ({
                amount: payment.amount,
                change: payment.change ?? 0,
                paymentMethod: payment.paymentMethod,
                installments: payment.installments,
              })),
            }
          : undefined,
      },
    });

    return OrderMapper.toDto(createdOrder);
  }

  async update(
    orderId: number,
    order: OrderDto,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<OrderDto> {
    const updatedOrder = await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: order.status,
        total: order.total,
        type: order.type,
        discount: order.discount,
        subtotal: order.subtotal,
        paid: order.paid,
        notes: order.notes,
        customerId: order.customerId,
        items: {
          deleteMany: {},
          createMany: {
            data: order.items,
          },
        },
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async updateNotes(orderId: number, updateStatusDto: UpdateNotesDto) {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        notes: updateStatusDto.notes,
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async updateStatus(
    orderId: number,
    updateStatusDto: UpdateStatusDto,
    tx: Prisma.TransactionClient = this.prisma,
  ) {
    const updatedOrder = await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: updateStatusDto.status,
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  async updateIsPaid(
    orderId: number,
    isPaid: boolean,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        paid: isPaid,
      },
    });
  }

  async deleteById(orderId: number): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  }

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  async findPayments(orderId: number): Promise<OrderPaymentDto[]> {
    const payments = await this.prisma.orderPayment.findMany({
      where: {
        orderId,
      },
    });

    return payments.map((payment) => OrderPaymentMapper.toDto(payment));
  }

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  async addPayment(
    orderId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<OrderDto> {
    const updatedOrder = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        payments: {
          create: {
            amount: createPaymentDto.amount,
            paymentMethod: createPaymentDto.paymentMethod,
            change: createPaymentDto.change,
            installments: createPaymentDto.installments,
          },
        },
      },
    });

    return OrderMapper.toDto(updatedOrder);
  }

  // =====================================
  // Mover para módulo Payment futuramente
  // =====================================
  async deletePayment(paymentId: number): Promise<void> {
    await this.prisma.orderPayment.delete({
      where: {
        id: paymentId,
      },
    });
  }
}
