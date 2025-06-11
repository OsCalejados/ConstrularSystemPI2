import { CustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { OrderRepository } from './repositories/order.repository';
import { OrderController } from './controllers/order.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';
import { PrismaCustomerRepository } from '../customer/repositories/prisma-customer.repository';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderRepository,
    PrismaService,
    OrderService,
    {
      provide: 'IOrderService',
      useExisting: OrderService,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
  exports: [OrderService, 'IOrderService'],
})
export class OrderModule {}
