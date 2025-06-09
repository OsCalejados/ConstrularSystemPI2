/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PrismaService } from 'src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(paymentId: number) {
    return false;
    // return await this.prisma.payment.findUnique({
    //   where: {
    //     id: paymentId,
    //   },
    // });
  }

  async create(payment: CreatePaymentDto) {
    return false;
    // return await this.prisma.payment.create({
    //   data: {
    //     value: payment.value,
    //     orderId: payment.orderId,
    //   },
    // });
  }

  async delete(paymentId: number) {
    return false;
    // return await this.prisma.payment.delete({
    //   where: {
    //     id: paymentId,
    //   },
    // });
  }
}
