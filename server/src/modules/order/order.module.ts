import { CustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { OrderController } from './controllers/order.controller';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';
import { PrismaCustomerRepository } from '../customer/repositories/prisma-customer.repository';
import { IOrderRepository } from './interfaces/order.repository.interface';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
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
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [OrderService, 'IOrderService'],
})
export class OrderModule {}
