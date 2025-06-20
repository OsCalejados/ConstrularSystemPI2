/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PrismaService } from '@src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../interfaces/payment.repository.interface';
import { OrderDto } from '../dtos/order.dto';
import { OrderPaymentMapper } from '../mappers/order-payment.mapper';
import { OrderPaymentDto } from '../dtos/order-payment.dto';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(paymentId: number): Promise<OrderPaymentDto> {
    const payment = await this.prisma.orderPayment.findUnique({
      where: {
        id: paymentId,
      },
    });

    return OrderPaymentMapper.toDto(payment);
  }

  async findByOrder(orderId: number): Promise<OrderPaymentDto[]> {
    const payments = await this.prisma.orderPayment.findMany({
      where: {
        orderId,
      },
    });

    return payments.map((payment) => OrderPaymentMapper.toDto(payment));
  }

  async create(payment: CreatePaymentDto): Promise<OrderPaymentDto> {
    const createdPayment = await this.prisma.orderPayment.create({
      data: {
        amount: payment.amount,
        change: payment.change,
        installments: payment.installments,
        paymentMethod: payment.paymentMethod,
        order: {
          connect: {
            id: payment.orderId,
          },
        },
      },
    });

    return OrderPaymentMapper.toDto(createdPayment);
  }

  async deleteById(paymentId: number): Promise<OrderPaymentDto> {
    const deletedPayment = await this.prisma.orderPayment.delete({
      where: {
        id: paymentId,
      },
    });

    return OrderPaymentMapper.toDto(deletedPayment);
  }
}
