import { PrismaCustomerRepository } from '../customer/repositories/prisma-customer.repository';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { CustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { OrderController } from './controllers/order.controller';
import { IOrderService } from './interfaces/order.service.interface';
import { PrismaService } from 'src/common/services/prisma.service';
import { OrderService } from './services/order.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    PrismaService,
    OrderService,
    {
      provide: IOrderService,
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
  exports: [OrderService, IOrderService, IOrderRepository],
})
export class OrderModule {}
