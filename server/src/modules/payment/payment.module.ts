import { PaymentController } from './controllers/payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { IOrderService } from '../order/interfaces/order.service.interface';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from '../order/services/order.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    PrismaService,
    {
      provide: IOrderService,
      useClass: OrderService,
    },
  ],
})
export class PaymentModule {}
