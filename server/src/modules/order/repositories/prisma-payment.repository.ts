import { IPaymentRepository } from '../interfaces/payment.repository.interface';
import { OrderPaymentMapper } from '../mappers/order-payment.mapper';
import { OrderPaymentDto } from '../dtos/order-payment.dto';
import { PrismaService } from '@src/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

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
}
