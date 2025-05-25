import { PrismaService } from 'src/common/services/prisma.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { Module } from '@nestjs/common';
import { OrderRepository } from 'src/order/repositories/order.repository';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    OrderRepository,
    PrismaService,
  ],
})
export class PaymentModule {}
